import { auth } from "@/auth"
import { NextResponse } from "next/server"
import { getUserWithProfile } from "@/server/actions/user"
import { prisma } from "@/lib/prisma"

/**
 * GET /api/auth/unified-session
 * 
 * Unified session endpoint that can return different levels of detail based on query parameters.
 * Replaces /session, /status, /session-status, and /profile endpoints.
 * 
 * Query Parameters:
 * - include: Comma-separated list of additional data to include
 *   - "profile": Include detailed user profile with role-specific data
 *   - "status": Include session status with expiry information
 *   - "sessions": Include list of all user sessions
 *   - "system": Include system information and available providers
 * 
 * @returns {Response} JSON response with session data
 * 
 * @example
 * // Basic session: GET /api/auth/unified-session
 * {
 *   "authenticated": true,
 *   "user": { "id": "...", "name": "...", "email": "...", "role": "..." }
 * }
 * 
 * // With profile: GET /api/auth/unified-session?include=profile
 * {
 *   "authenticated": true,
 *   "user": { ... },
 *   "profile": { ...detailed profile with student/mentor data... }
 * }
 * 
 * // With status: GET /api/auth/unified-session?include=status
 * {
 *   "authenticated": true,
 *   "user": { ... },
 *   "sessionStatus": {
 *     "expires": "2025-07-20T10:30:00.000Z",
 *     "timeRemaining": 86400,
 *     "expired": false
 *   }
 * }
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const include = searchParams.get('include')?.split(',') || []
    
    const session = await auth()
    
    if (!session?.user) {
      return NextResponse.json({
        authenticated: false,
        user: null,
        timestamp: new Date().toISOString()
      })
    }

    const response: any = {
      authenticated: true,
      user: session.user,
      timestamp: new Date().toISOString()
    }

    // Include detailed profile if requested
    if (include.includes('profile')) {
      const userId = (session.user as any).id
      if (userId) {
        const profileResult = await getUserWithProfile(userId)
        if ('user' in profileResult) {
          response.profile = profileResult.user
        }
      }
    }

    // Include session status if requested
    if (include.includes('status')) {
      const now = Date.now()
      const expiresAt = new Date(session.expires).getTime()
      const timeRemaining = Math.max(0, Math.floor((expiresAt - now) / 1000))
      const expired = timeRemaining === 0
      
      response.sessionStatus = {
        expires: session.expires,
        expiresAt: new Date(expiresAt).toISOString(),
        timeRemaining,
        timeRemainingFormatted: formatTimeRemaining(timeRemaining),
        expired,
        warnings: {
          showWarning: !expired && timeRemaining <= 300, // 5 minutes
          showUrgentWarning: !expired && timeRemaining <= 60, // 1 minute
        }
      }
    }

    // Include active sessions if requested
    if (include.includes('sessions')) {
      const userId = (session.user as any).id
      if (userId) {
        const userSessions = await prisma.session.findMany({
          where: { userId },
          select: { 
            id: true, 
            expires: true,
            sessionToken: true 
          },
          orderBy: { expires: 'desc' }
        })
        
        response.activeSessions = userSessions.map(s => ({
          id: s.id,
          expires: s.expires,
          expiresAt: s.expires.toISOString(),
          isActive: s.expires > new Date(),
          timeUntilExpiry: Math.max(0, Math.floor((s.expires.getTime() - Date.now()) / 1000))
        }))
        response.totalSessions = userSessions.length
      }
    }

    // Include system information if requested
    if (include.includes('system')) {
      response.system = {
        providers: ["github", "google", "facebook", "email", "credentials"],
        endpoints: {
          register: "/api/auth/unified-register",
          signIn: "/api/auth/unified-signin",
          signOut: "/api/auth/sign-out",
          session: "/api/auth/unified-session"
        }
      }
    }

    return NextResponse.json(response)
    
  } catch (error) {
    console.error("Session error:", error)
    return NextResponse.json(
      { 
        error: "Failed to retrieve session",
        authenticated: false,
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}

/**
 * Helper function to format time remaining in a human-readable format
 * @param seconds - Time remaining in seconds
 * @returns Formatted string like "2h 30m" or "45m" or "30s"
 */
function formatTimeRemaining(seconds: number): string {
  if (seconds <= 0) return "Expired"
  
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const remainingSeconds = seconds % 60
  
  if (hours > 0) {
    return `${hours}h ${minutes}m`
  } else if (minutes > 0) {
    return `${minutes}m`
  } else {
    return `${remainingSeconds}s`
  }
}

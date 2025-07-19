import { auth } from "@/auth"
import { NextResponse } from "next/server"

/**
 * GET /api/auth/status
 * 
 * Returns the current authentication status and system information.
 * This endpoint is useful for health checks and status monitoring.
 * 
 * @returns {Response} JSON response containing authentication status and system info
 * 
 * @example
 * // Response for authenticated user:
 * {
 *   "authenticated": true,
 *   "user": {
 *     "id": "clh1234567890",
 *     "role": "STUDENT"
 *   },
 *   "providers": ["github", "google", "facebook"],
 *   "timestamp": "2025-07-19T10:30:00.000Z"
 * }
 * 
 * // Response for unauthenticated user:
 * {
 *   "authenticated": false,
 *   "providers": ["github", "google", "facebook"],
 *   "timestamp": "2025-07-19T10:30:00.000Z"
 * }
 */
export async function GET() {
  try {
    // Get the current session
    const session = await auth()
    
    // List of available authentication providers
    const providers = ["github", "google", "facebook", "email", "credentials"]
    
    // Base response structure
    const response = {
      authenticated: !!session?.user,
      providers,
      timestamp: new Date().toISOString()
    }
    
    // If user is authenticated, include minimal user info
    if (session?.user) {
      const user = session.user as any
      return NextResponse.json({
        ...response,
        user: {
          id: user.id,
          role: user.role,
          name: user.name,
          email: user.email
        }
      }, { status: 200 })
    }
    
    // Return unauthenticated status
    return NextResponse.json(response, { status: 200 })
    
  } catch (error) {
    console.error("Error checking authentication status:", error)
    return NextResponse.json(
      { 
        error: "Failed to check authentication status",
        authenticated: false,
        timestamp: new Date().toISOString()
      }, 
      { status: 500 }
    )
  }
}

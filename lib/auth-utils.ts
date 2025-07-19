import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { PrismaClient } from "@/lib/generated/prisma"
import type { UserRole } from "@/lib/generated/prisma"

const prisma = new PrismaClient()

/**
 * Get the current session and user
 * @returns Session object or null if not authenticated
 */
export async function getCurrentSession() {
  return await auth()
}

/**
 * Get the current user or redirect to login if not authenticated
 * @returns User object
 */
export async function requireAuth() {
  const session = await auth()
  
  if (!session?.user) {
    redirect("/login")
  }
  
  return session.user
}

/**
 * Require a specific role or redirect to appropriate dashboard
 * @param requiredRole - The role required to access the resource
 * @returns User object if role matches
 */
export async function requireRole(requiredRole: UserRole) {
  const session = await auth()
  
  if (!session?.user) {
    redirect("/login")
  }
  
  const userRole = (session.user as any).role as UserRole
  
  if (userRole !== requiredRole) {
    // Redirect to appropriate dashboard based on user's actual role
    if (userRole === "STUDENT") {
      redirect("/student/dashboard")
    } else if (userRole === "MENTOR") {
      redirect("/mentor/dashboard")
    } else {
      redirect("/login")
    }
  }
  
  return session.user
}

/**
 * Check if user has a specific role
 * @param userRole - The user's role
 * @param requiredRole - The required role
 * @returns Boolean indicating if user has the required role
 */
export function hasRole(userRole: UserRole, requiredRole: UserRole): boolean {
  return userRole === requiredRole
}

/**
 * Check if user is a student
 * @param userRole - The user's role
 * @returns Boolean indicating if user is a student
 */
export function isStudent(userRole: UserRole): boolean {
  return userRole === "STUDENT"
}

/**
 * Check if user is a mentor
 * @param userRole - The user's role
 * @returns Boolean indicating if user is a mentor
 */
export function isMentor(userRole: UserRole): boolean {
  return userRole === "MENTOR"
}

/**
 * Check if the current session is expired based on database session data
 * @returns Boolean indicating if session is expired
 */
export async function isSessionExpired(): Promise<boolean> {
  try {
    const session = await auth()
    
    if (!session?.user) {
      return true // No session exists
    }

    // For database sessions, Auth.js automatically handles expiry checking
    // If we get a valid session here, it means it's not expired
    return false
  } catch (error) {
    console.error("Error checking session expiration:", error)
    return true // Assume expired on error
  }
}

/**
 * Get all active sessions for the current user
 * @returns Array of session objects
 */
export async function getUserSessions() {
  const session = await auth()
  
  if (!session?.user?.id) {
    return []
  }

  return await prisma.session.findMany({
    where: { 
      userId: (session.user as any).id,
      expires: {
        gt: new Date() // Only active sessions
      }
    },
    orderBy: {
      expires: 'desc'
    }
  })
}

/**
 * Revoke a specific session for the current user
 * @param sessionId - The ID of the session to revoke
 * @returns Boolean indicating success
 */
export async function revokeSession(sessionId: string): Promise<boolean> {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return false
    }

    // Verify the session belongs to the current user
    const targetSession = await prisma.session.findUnique({
      where: { id: sessionId }
    })

    if (!targetSession || targetSession.userId !== (session.user as any).id) {
      return false
    }

    await prisma.session.delete({
      where: { id: sessionId }
    })

    return true
  } catch (error) {
    console.error("Error revoking session:", error)
    return false
  }
}

/**
 * Get remaining session time in seconds
 * @returns Number of seconds until session expires, or 0 if expired
 */
export async function getSessionTimeRemaining(): Promise<number> {
  try {
    const session = await auth()
    
    if (!session?.user) {
      return 0
    }

    // Calculate time remaining based on session.expires
    const expiresAt = new Date(session.expires).getTime()
    const now = Date.now()
    const timeRemaining = Math.max(0, Math.floor((expiresAt - now) / 1000))
    
    return timeRemaining
  } catch (error) {
    console.error("Error calculating session time:", error)
    return 0
  }
}

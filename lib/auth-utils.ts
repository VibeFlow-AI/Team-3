import { auth } from "@/auth"
import { redirect } from "next/navigation"
import type { UserRole } from "@/lib/generated/prisma"

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

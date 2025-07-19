import { auth } from "@/auth"
import { NextResponse } from "next/server"
import { createErrorResponse } from "./api-utils"
import type { UserRole } from "@/lib/generated/prisma"

/**
 * Authentication result interface
 */
export interface AuthResult {
  success: true
  user: {
    id: string
    email?: string | null
    name?: string | null
    role: UserRole
  }
}

export interface AuthError {
  success: false
  response: NextResponse
}

/**
 * Validates that the user is authenticated
 * @returns AuthResult if authenticated, AuthError with response if not
 */
export async function requireAuth(): Promise<AuthResult | AuthError> {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return {
        success: false,
        response: createErrorResponse("Authentication required", 401)
      }
    }

    return {
      success: true,
      user: {
        id: session.user.id,
        email: session.user.email,
        name: session.user.name,
        role: (session.user as any).role as UserRole
      }
    }
  } catch (error) {
    console.error("AUTH_VALIDATION_ERROR", error)
    return {
      success: false,
      response: createErrorResponse("Authentication validation failed", 500)
    }
  }
}

/**
 * Validates that the user is authenticated and has a specific role
 * @param requiredRole - The role required to access the resource
 * @returns AuthResult if authorized, AuthError with response if not
 */
export async function requireRole(requiredRole: UserRole): Promise<AuthResult | AuthError> {
  const authResult = await requireAuth()
  
  if (!authResult.success) {
    return authResult
  }
  
  if (authResult.user.role !== requiredRole) {
    return {
      success: false,
      response: createErrorResponse(
        `Access denied. ${requiredRole} role required.`,
        403
      )
    }
  }
  
  return authResult
}

/**
 * Validates that the user is authenticated and has one of the specified roles
 * @param allowedRoles - Array of roles that are allowed to access the resource
 * @returns AuthResult if authorized, AuthError with response if not
 */
export async function requireAnyRole(allowedRoles: UserRole[]): Promise<AuthResult | AuthError> {
  const authResult = await requireAuth()
  
  if (!authResult.success) {
    return authResult
  }
  
  if (!allowedRoles.includes(authResult.user.role)) {
    return {
      success: false,
      response: createErrorResponse(
        `Access denied. One of the following roles required: ${allowedRoles.join(", ")}`,
        403
      )
    }
  }
  
  return authResult
}

import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { updateUserRole } from "@/server/actions/user"
import type { UserRole } from "@/lib/generated/prisma"

/**
 * PUT /api/user/role
 * 
 * Updates the authenticated user's role and creates the corresponding profile.
 * This endpoint allows users to switch between STUDENT and MENTOR roles during onboarding.
 * 
 * @param {Request} request - The incoming request containing role and optional profile data
 * @returns {Response} JSON response with update result
 * 
 * @example
 * // Request body:
 * {
 *   "role": "MENTOR",
 *   "profileData": {
 *     "professionalRole": "Teacher",
 *     "bio": "Experienced educator",
 *     "expertise": "Mathematics"
 *   }
 * }
 * 
 * // Success response:
 * {
 *   "success": true,
 *   "message": "Role updated successfully",
 *   "user": {
 *     "id": "clh1234567890",
 *     "role": "MENTOR"
 *   }
 * }
 */
export async function PUT(request: Request) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { role, profileData } = body

    // Validate role
    if (!role || !["STUDENT", "MENTOR", "ADMIN"].includes(role)) {
      return NextResponse.json(
        { error: "Invalid role. Must be STUDENT, MENTOR, or ADMIN" },
        { status: 400 }
      )
    }

    // Update user role using server action
    const result = await updateUserRole(session.user.id, role as UserRole, profileData)

    if ("error" in result) {
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: "Role updated successfully",
      user: result.user,
    })

  } catch (error) {
    console.error("USER_ROLE_UPDATE_ERROR", error)
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    )
  }
}

/**
 * GET /api/user/role
 * 
 * Returns the current user's role information.
 * 
 * @returns {Response} JSON response with user role data
 */
export async function GET() {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      )
    }

    return NextResponse.json({
      role: (session.user as any).role,
      userId: session.user.id,
    })

  } catch (error) {
    console.error("USER_ROLE_GET_ERROR", error)
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    )
  }
}

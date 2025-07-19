import { auth } from "@/auth"
import { NextResponse } from "next/server"
import { getUserWithProfile } from "@/server/actions/user"

/**
 * GET /api/auth/profile
 * 
 * Retrieves the current user's complete profile including role-specific data.
 * This endpoint returns detailed user information including Student or Mentor profile data.
 * 
 * @returns {Response} JSON response containing:
 *   - If authenticated: { user: { ...userData, student?: {...}, mentor?: {...} } }
 *   - If not authenticated: { error: "Not authenticated" }
 * 
 * @example
 * // Successful response for authenticated student
 * {
 *   "user": {
 *     "id": "clh1234567890",
 *     "name": "John Doe",
 *     "email": "john@example.com",
 *     "role": "STUDENT",
 *     "student": {
 *       "currentEducationLevel": "Undergraduate",
 *       "school": "MIT",
 *       "subjectsOfInterest": "Computer Science, Mathematics"
 *     }
 *   }
 * }
 */
export async function GET() {
  try {
    // Get the current session to check authentication
    const session = await auth()
    
    if (!session?.user) {
      return NextResponse.json(
        { error: "Not authenticated" }, 
        { status: 401 }
      )
    }
    
    // Get the user ID from the session
    const userId = (session.user as any).id
    
    if (!userId) {
      return NextResponse.json(
        { error: "Invalid session data" }, 
        { status: 400 }
      )
    }
    
    // Fetch the complete user profile including role-specific data
    const result = await getUserWithProfile(userId)
    
    if ('error' in result) {
      return NextResponse.json(
        { error: result.error }, 
        { status: 404 }
      )
    }
    
    // Return the complete user profile
    return NextResponse.json({ 
      user: result.user 
    }, { status: 200 })
    
  } catch (error) {
    console.error("Error fetching user profile:", error)
    return NextResponse.json(
      { error: "Failed to retrieve user profile" }, 
      { status: 500 }
    )
  }
}

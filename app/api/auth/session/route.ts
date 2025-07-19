import { auth } from "@/auth"
import { NextResponse } from "next/server"

/**
 * GET /api/auth/session
 * 
 * Retrieves the current user's session information including role and profile data.
 * This endpoint is used by the frontend to check authentication status and get user details.
 * 
 * @returns {Response} JSON response containing:
 *   - If authenticated: { user: { id, name, email, role, image } }
 *   - If not authenticated: null
 * 
 * @example
 * // Successful response for authenticated user
 * {
 *   "user": {
 *     "id": "clh1234567890",
 *     "name": "John Doe",
 *     "email": "john@example.com",
 *     "role": "STUDENT",
 *     "image": "https://avatars.githubusercontent.com/u/123456"
 *   }
 * }
 */
export async function GET() {
  try {
    // Use Auth.js helper to get the current session
    const session = await auth()
    
    // If no session exists or user is not authenticated, return null
    if (!session || !session.user) {
      return NextResponse.json(null, { status: 200 })
    }

    // Return the user data from the session
    // The session already includes the augmented user data with role and id
    // from the JWT callback in auth.ts
    return NextResponse.json({ 
      user: session.user 
    }, { status: 200 })
    
  } catch (error) {
    console.error("Error fetching session:", error)
    return NextResponse.json(
      { error: "Failed to retrieve session" }, 
      { status: 500 }
    )
  }
}

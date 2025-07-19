import { signOut } from "@/auth"
import { NextResponse } from "next/server"

/**
 * POST /api/auth/sign-out
 * 
 * Handles user sign-out by destroying the current session.
 * This endpoint clears the user's authentication tokens and session data.
 * 
 * @returns {Response} JSON response with success message
 * 
 * @example
 * // Request: POST /api/auth/sign-out
 * // Response: { "message": "Signed out successfully", "success": true }
 */
export async function POST() {
  try {
    // Use Auth.js helper to sign out the user
    // Setting redirect: false prevents automatic redirection
    // This allows the frontend to handle the post-signout flow
    await signOut({ redirect: false })
    
    return NextResponse.json({ 
      message: "Signed out successfully",
      success: true 
    }, { status: 200 })
    
  } catch (error) {
    console.error("Error during sign-out:", error)
    return NextResponse.json(
      { 
        error: "Failed to sign out",
        success: false 
      }, 
      { status: 500 }
    )
  }
}

/**
 * GET /api/auth/sign-out
 * 
 * Alternative endpoint for sign-out via GET request.
 * This can be useful for logout links that don't use JavaScript.
 * 
 * @returns {Response} JSON response with success message
 */
export async function GET() {
  try {
    await signOut({ redirect: false })
    
    return NextResponse.json({ 
      message: "Signed out successfully",
      success: true 
    }, { status: 200 })
    
  } catch (error) {
    console.error("Error during sign-out:", error)
    return NextResponse.json(
      { 
        error: "Failed to sign out",
        success: false 
      }, 
      { status: 500 }
    )
  }
}

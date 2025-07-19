import { signIn } from "@/auth"
import { NextRequest, NextResponse } from "next/server"

/**
 * POST /api/auth/credentials
 * 
 * Handles credentials-based authentication (email and password).
 * This endpoint processes login attempts with email/password combinations.
 * 
 * @param {NextRequest} request - The incoming request containing credentials
 * @returns {Response} JSON response with authentication result
 * 
 * @example
 * // Request body:
 * {
 *   "email": "user@example.com",
 *   "password": "userPassword123"
 * }
 * 
 * // Success response:
 * {
 *   "message": "Authentication successful",
 *   "success": true
 * }
 * 
 * // Error response:
 * {
 *   "error": "Invalid credentials",
 *   "success": false
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password, callbackUrl } = body
    
    // Validate that credentials were provided
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required", success: false }, 
        { status: 400 }
      )
    }
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format", success: false },
        { status: 400 }
      )
    }
    
    // Configure sign-in options
    const options: any = { 
      redirect: false,
      email,
      password
    }
    
    if (callbackUrl) {
      options.redirectTo = callbackUrl
    }
    
    // Attempt to sign in with credentials
    try {
      const result = await signIn("credentials", options)
      
      return NextResponse.json({ 
        message: "Authentication successful",
        success: true
      }, { status: 200 })
      
    } catch (authError) {
      console.error("Authentication failed:", authError)
      return NextResponse.json(
        { 
          error: "Invalid credentials",
          success: false 
        }, 
        { status: 401 }
      )
    }
    
  } catch (error) {
    console.error("Error during credentials authentication:", error)
    return NextResponse.json(
      { 
        error: "Authentication failed",
        success: false 
      }, 
      { status: 500 }
    )
  }
}

/**
 * GET /api/auth/credentials
 * 
 * Returns information about the credentials authentication endpoint.
 * 
 * @returns {Response} JSON response with endpoint information
 */
export async function GET() {
  return NextResponse.json({
    message: "Credentials authentication endpoint",
    method: "POST",
    requiredFields: ["email", "password"],
    optionalFields: ["callbackUrl"]
  })
}

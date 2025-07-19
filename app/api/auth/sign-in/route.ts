import { signIn } from "@/auth"
import { NextRequest, NextResponse } from "next/server"

/**
 * Interface for unified sign-in supporting all authentication methods
 */
interface UnifiedSignInData {
  provider: string
  email?: string
  password?: string
  callbackUrl?: string
}

/**
 * POST /api/auth/unified-signin
 * 
 * Unified sign-in endpoint supporting all authentication methods.
 * Handles OAuth providers (github, google, facebook) and credentials-based authentication.
 * 
 * @param {NextRequest} request - Sign-in data with provider and optional credentials
 * @returns {Response} JSON response with authentication result
 * 
 * @example
 * // OAuth sign-in:
 * {
 *   "provider": "github",
 *   "callbackUrl": "/dashboard"
 * }
 * 
 * // Credentials sign-in:
 * {
 *   "provider": "credentials",
 *   "email": "user@example.com",
 *   "password": "password123",
 *   "callbackUrl": "/dashboard"
 * }
 * 
 * // Success response:
 * {
 *   "success": true,
 *   "message": "Authentication successful",
 *   "provider": "github"
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const body: UnifiedSignInData = await request.json()
    const { provider, email, password, callbackUrl } = body
    
    if (!provider) {
      return NextResponse.json(
        { error: "Provider is required", success: false },
        { status: 400 }
      )
    }

    const validProviders = ["github", "google", "facebook", "email", "credentials"]
    if (!validProviders.includes(provider.toLowerCase())) {
      return NextResponse.json(
        { 
          error: `Invalid provider. Must be one of: ${validProviders.join(", ")}`,
          success: false 
        },
        { status: 400 }
      )
    }

    // Handle credentials authentication
    if (provider === "credentials") {
      if (!email || !password) {
        return NextResponse.json(
          { error: "Email and password are required for credentials sign-in", success: false },
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
      
      try {
        const result = await signIn("credentials", {
          redirect: false,
          email,
          password,
          ...(callbackUrl && { redirectTo: callbackUrl })
        })
        
        return NextResponse.json({
          success: true,
          message: "Authentication successful",
          provider: "credentials"
        })
      } catch (authError) {
        console.error("Credentials authentication failed:", authError)
        return NextResponse.json(
          { 
            error: "Invalid credentials",
            success: false 
          },
          { status: 401 }
        )
      }
    }

    // Handle OAuth providers
    try {
      const result = await signIn(provider, {
        redirect: false,
        ...(callbackUrl && { redirectTo: callbackUrl })
      })

      return NextResponse.json({
        success: true,
        message: `Sign-in initiated with ${provider}`,
        provider
      })
    } catch (error) {
      console.error(`${provider} sign-in error:`, error)
      return NextResponse.json(
        { 
          error: `Failed to initiate sign-in with ${provider}`,
          success: false 
        },
        { status: 500 }
      )
    }

  } catch (error) {
    console.error("Sign-in error:", error)
    return NextResponse.json(
      { 
        error: "Sign-in failed",
        success: false 
      },
      { status: 500 }
    )
  }
}

/**
 * GET /api/auth/unified-signin
 * 
 * Returns information about available authentication providers and methods.
 * 
 * @returns {Response} JSON response with provider information
 */
export async function GET() {
  try {
    const providers = [
      {
        id: "github",
        name: "GitHub",
        type: "oauth",
        description: "Sign in with your GitHub account"
      },
      {
        id: "google",
        name: "Google",
        type: "oauth", 
        description: "Sign in with your Google account"
      },
      {
        id: "facebook",
        name: "Facebook",
        type: "oauth",
        description: "Sign in with your Facebook account"
      },
      {
        id: "credentials",
        name: "Email & Password",
        type: "credentials",
        description: "Sign in with email and password",
        requiredFields: ["email", "password"]
      }
    ]
    
    return NextResponse.json({
      message: "Available authentication providers",
      providers,
      endpoints: {
        signin: "/api/auth/unified-signin",
        register: "/api/auth/unified-register",
        session: "/api/auth/unified-session",
        signout: "/api/auth/sign-out"
      }
    })
    
  } catch (error) {
    console.error("Error fetching providers:", error)
    return NextResponse.json(
      { error: "Failed to fetch providers" },
      { status: 500 }
    )
  }
}

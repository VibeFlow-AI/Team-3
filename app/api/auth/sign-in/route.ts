import { signIn } from "@/auth"
import { NextRequest, NextResponse } from "next/server"

/**
 * POST /api/auth/sign-in
 * 
 * Initiates OAuth sign-in flow with the specified provider.
 * This endpoint is useful for programmatic sign-in requests or when you need
 * to handle sign-in logic on the server side.
 * 
 * @param {NextRequest} request - The incoming request containing provider information
 * @returns {Response} JSON response with sign-in status or error
 * 
 * @example
 * // Request body: { "provider": "github" }
 * // Response: { "message": "Sign-in initiated with github", "success": true }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { provider, callbackUrl } = body
    
    // Validate that a provider was specified
    if (!provider) {
      return NextResponse.json(
        { error: "Provider is required", success: false }, 
        { status: 400 }
      )
    }
    
    // Validate that the provider is one of our configured providers
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
    
    // Optional callback URL for post-authentication redirect
    const options: any = { redirect: false }
    if (callbackUrl) {
      options.redirectTo = callbackUrl
    }
    
    // Initiate the OAuth sign-in process
    // Note: This will typically redirect the user to the OAuth provider
    await signIn(provider, options)
    
    return NextResponse.json({ 
      message: `Sign-in initiated with ${provider}`,
      success: true
    }, { status: 200 })
    
  } catch (error) {
    console.error("Error during sign-in:", error)
    return NextResponse.json(
      { 
        error: "Failed to initiate sign-in",
        success: false 
      }, 
      { status: 500 }
    )
  }
}

/**
 * GET /api/auth/sign-in
 * 
 * Returns information about available authentication providers.
 * This can be used by the frontend to dynamically display sign-in options.
 * 
 * @returns {Response} JSON response with available providers
 * 
 * @example
 * // Response:
 * {
 *   "providers": ["github", "google", "facebook"],
 *   "message": "Available authentication providers"
 * }
 */
export async function GET() {
  try {
    const providers = ["github", "google", "facebook", "email", "credentials"]
    
    return NextResponse.json({
      providers,
      message: "Available authentication providers"
    }, { status: 200 })
    
  } catch (error) {
    console.error("Error fetching providers:", error)
    return NextResponse.json(
      { error: "Failed to fetch providers" }, 
      { status: 500 }
    )
  }
}

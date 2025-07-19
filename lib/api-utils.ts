import { NextResponse } from "next/server"

/**
 * Standard API response interfaces for consistent formatting
 */
export interface ApiSuccessResponse<T = any> {
  success: true
  message?: string
  data?: T
}

export interface ApiErrorResponse {
  error: string
  success: false
  details?: any
}

/**
 * Creates a standardized success response
 * @param data - The data to return
 * @param message - Optional success message
 * @param status - HTTP status code (default: 200)
 */
export function createSuccessResponse<T>(
  data?: T,
  message?: string,
  status: number = 200
): NextResponse {
  const response: ApiSuccessResponse<T> = {
    success: true,
    ...(message && { message }),
    ...(data && { data }),
  }
  
  return NextResponse.json(response, { status })
}

/**
 * Creates a standardized error response
 * @param error - Error message
 * @param status - HTTP status code
 * @param details - Optional additional error details
 */
export function createErrorResponse(
  error: string,
  status: number,
  details?: any
): NextResponse {
  const response: ApiErrorResponse = {
    error,
    success: false,
    ...(details && { details }),
  }
  
  return NextResponse.json(response, { status })
}

/**
 * Handles and logs API errors consistently
 * @param error - The error object
 * @param context - Context string for logging (e.g., "USER_REGISTRATION")
 * @param userMessage - User-friendly error message
 */
export function handleApiError(
  error: any,
  context: string,
  userMessage: string = "Internal Server Error"
): NextResponse {
  console.error(`${context}_ERROR`, error)
  
  return createErrorResponse(userMessage, 500)
}

/**
 * Validates required fields in request body
 * @param body - Request body object
 * @param requiredFields - Array of required field names
 * @returns null if valid, or NextResponse with error if invalid
 */
export function validateRequiredFields(
  body: any,
  requiredFields: string[]
): NextResponse | null {
  const missingFields = requiredFields.filter(field => !body[field])
  
  if (missingFields.length > 0) {
    return createErrorResponse(
      `Missing required fields: ${missingFields.join(", ")}`,
      400
    )
  }
  
  return null
}

/**
 * Validates email format
 * @param email - Email string to validate
 * @returns true if valid, false otherwise
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Validates password strength
 * @param password - Password to validate
 * @param minLength - Minimum password length (default: 6)
 * @returns null if valid, or error message if invalid
 */
export function validatePassword(password: string, minLength: number = 6): string | null {
  if (!password) {
    return "Password is required"
  }
  
  if (password.length < minLength) {
    return `Password must be at least ${minLength} characters long`
  }
  
  return null
}

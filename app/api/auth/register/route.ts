import { NextResponse } from "next/server"
import { PrismaClient } from "@/lib/generated/prisma"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

/**
 * POST /api/auth/register
 * 
 * Handles user registration for credentials-based authentication.
 * Creates a new user account with email and hashed password.
 * 
 * @param {Request} request - The incoming request containing user registration data
 * @returns {Response} JSON response with user data or error message
 * 
 * @example
 * // Request body:
 * {
 *   "name": "John Doe",
 *   "email": "john@example.com",
 *   "password": "securePassword123"
 * }
 * 
 * // Success response:
 * {
 *   "id": "clh1234567890",
 *   "name": "John Doe",
 *   "email": "john@example.com",
 *   "role": "STUDENT"
 * }
 */
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, email, password } = body

    // --- VALIDATION ---
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Missing required fields: name, email, or password" },
        { status: 400 }
      )
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      )
    }

    // Password strength validation (minimum 6 characters)
    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters long" },
        { status: 400 }
      )
    }

    // --- CHECK IF USER EXISTS ---
    const existingUser = await prisma.user.findUnique({
      where: { email: email },
    })

    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 409 }
      )
    }

    // --- HASH PASSWORD ---
    const hashedPassword = await bcrypt.hash(password, 12)

    // --- CREATE USER ---
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        // Role defaults to STUDENT as per schema
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        // Exclude password from response for security
      },
    })

    return NextResponse.json(
      {
        message: "User created successfully",
        user,
      },
      { status: 201 }
    )

  } catch (error) {
    console.error("REGISTRATION_ERROR", error)
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    )
  }
}

/**
 * GET /api/auth/register
 * 
 * Returns information about the registration endpoint.
 * This can be used to check if registration is available.
 * 
 * @returns {Response} JSON response with registration information
 */
export async function GET() {
  return NextResponse.json({
    message: "User registration endpoint",
    methods: ["POST"],
    requiredFields: ["name", "email", "password"],
  })
}

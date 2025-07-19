import { NextResponse } from "next/server"
import { PrismaClient } from "@/lib/generated/prisma"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

/**
 * Interface for complete mentor registration with onboarding
 */
interface MentorRegistrationData {
  // Part 1: Personal Information
  fullName: string
  age: number
  email: string
  contactNumber: string
  password: string
  preferredLanguage: string // English, Sinhala, Tamil, Other
  currentLocation: string
  bio: string // Short bio (2-3 sentences)
  professionalRole: string

  // Part 2: Areas of Expertise
  subjectsToTeach: string[] // Array of subjects to teach
  teachingExperience: string // None, 1-3 years, 3-5 years, 5+ years
  preferredStudentLevels: string[] // Array of levels: Grade 3-5, Grade 6-9, etc.

  // Part 3: Social & Professional Links
  linkedinProfile: string // LinkedIn URL (mandatory)
  githubPortfolio?: string // GitHub or Portfolio URL (optional)
  profilePictureUrl?: string // Profile picture URL
}

/**
 * POST /api/auth/mentor/register
 * 
 * Handles complete mentor registration with multi-part onboarding data.
 * Creates a new mentor account with comprehensive profile information.
 * 
 * @param {Request} request - The incoming request containing mentor registration and onboarding data
 * @returns {Response} JSON response with user data or error message
 * 
 * @example
 * // Request body:
 * {
 *   "fullName": "Dr. Jane Smith",
 *   "age": 35,
 *   "email": "jane.smith@university.edu",
 *   "contactNumber": "+1234567890",
 *   "password": "securePassword123",
 *   "preferredLanguage": "English",
 *   "currentLocation": "Colombo, Sri Lanka",
 *   "bio": "Experienced physics teacher with 10 years of experience. Passionate about making complex concepts simple.",
 *   "professionalRole": "Senior Physics Lecturer",
 *   "subjectsToTeach": ["Physics", "Mathematics"],
 *   "teachingExperience": "5+ years",
 *   "preferredStudentLevels": ["Grade 10-11", "Advanced Level"],
 *   "linkedinProfile": "https://linkedin.com/in/janesmith",
 *   "githubPortfolio": "https://github.com/janesmith",
 *   "profilePictureUrl": "https://example.com/profile.jpg"
 * }
 * 
 * // Success response:
 * {
 *   "message": "Mentor registered successfully",
 *   "user": {
 *     "id": "clh1234567890",
 *     "fullName": "Dr. Jane Smith",
 *     "email": "jane.smith@university.edu",
 *     "role": "MENTOR"
 *   }
 * }
 */
export async function POST(request: Request) {
  try {
    const body: MentorRegistrationData = await request.json()
    
    const {
      // Part 1: Personal Information
      fullName,
      age,
      email,
      contactNumber,
      password,
      preferredLanguage,
      currentLocation,
      bio,
      professionalRole,
      
      // Part 2: Areas of Expertise
      subjectsToTeach,
      teachingExperience,
      preferredStudentLevels,
      
      // Part 3: Social & Professional Links
      linkedinProfile,
      githubPortfolio,
      profilePictureUrl,
    } = body

    // --- VALIDATION ---
    
    // Part 1 validation
    if (!fullName || !age || !email || !contactNumber || !password || !preferredLanguage || !currentLocation || !bio || !professionalRole) {
      return NextResponse.json(
        { error: "Missing required personal information fields" },
        { status: 400 }
      )
    }

    // Part 2 validation
    if (!subjectsToTeach || subjectsToTeach.length === 0 || !teachingExperience || !preferredStudentLevels || preferredStudentLevels.length === 0) {
      return NextResponse.json(
        { error: "Missing required expertise and teaching fields" },
        { status: 400 }
      )
    }

    // Part 3 validation
    if (!linkedinProfile) {
      return NextResponse.json(
        { error: "LinkedIn profile is required" },
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

    // Age validation for mentors (must be at least 18)
    if (age < 18 || age > 80) {
      return NextResponse.json(
        { error: "Age must be between 18 and 80 for mentors" },
        { status: 400 }
      )
    }

    // LinkedIn URL validation
    const linkedinRegex = /^https?:\/\/(www\.)?linkedin\.com\/in\/[a-zA-Z0-9-]+\/?$/
    if (!linkedinRegex.test(linkedinProfile)) {
      return NextResponse.json(
        { error: "Please provide a valid LinkedIn profile URL" },
        { status: 400 }
      )
    }

    // GitHub/Portfolio URL validation (if provided)
    if (githubPortfolio) {
      const urlRegex = /^https?:\/\/.+$/
      if (!urlRegex.test(githubPortfolio)) {
        return NextResponse.json(
          { error: "Please provide a valid GitHub or portfolio URL" },
          { status: 400 }
        )
      }
    }

    // --- CHECK IF USER EXISTS ---
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 409 }
      )
    }

    // --- HASH PASSWORD ---
    const hashedPassword = await bcrypt.hash(password, 12)

    // --- CREATE USER AND MENTOR PROFILE ---
    const result = await prisma.$transaction(async (tx) => {
      // Create user with basic and personal information
      const user = await tx.user.create({
        data: {
          fullName,
          age,
          email,
          contactNumber,
          password: hashedPassword,
          role: "MENTOR",
        },
      })

      // Create mentor profile with complete onboarding data
      const mentor = await tx.mentor.create({
        data: {
          userId: user.id,
          preferredLanguage,
          currentLocation,
          bio,
          professionalRole,
          subjectsToTeach: subjectsToTeach.join(", "),
          teachingExperience,
          preferredStudentLevels: preferredStudentLevels.join(", "),
          linkedinProfile,
          githubPortfolio: githubPortfolio || null,
          profilePictureUrl: profilePictureUrl || null,
          onboardingCompleted: true,
          onboardingStep: 3, // Completed all steps
        },
      })

      return { user, mentor }
    })

    // Return user data (excluding password for security)
    return NextResponse.json(
      {
        message: "Mentor registered successfully with complete profile",
        user: {
          id: result.user.id,
          fullName: result.user.fullName,
          email: result.user.email,
          role: result.user.role,
          age: result.user.age,
          contactNumber: result.user.contactNumber,
        },
        mentor: {
          id: result.mentor.id,
          preferredLanguage: result.mentor.preferredLanguage,
          currentLocation: result.mentor.currentLocation,
          bio: result.mentor.bio,
          professionalRole: result.mentor.professionalRole,
          subjectsToTeach: result.mentor.subjectsToTeach?.split(", ") || [],
          teachingExperience: result.mentor.teachingExperience,
          preferredStudentLevels: result.mentor.preferredStudentLevels?.split(", ") || [],
          linkedinProfile: result.mentor.linkedinProfile,
          githubPortfolio: result.mentor.githubPortfolio,
          profilePictureUrl: result.mentor.profilePictureUrl,
          onboardingCompleted: result.mentor.onboardingCompleted,
        },
      },
      { status: 201 }
    )

  } catch (error) {
    console.error("MENTOR_REGISTRATION_ERROR", error)
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    )
  }
}

/**
 * GET /api/auth/mentor/register
 * 
 * Returns information about the mentor registration endpoint.
 * Includes all required fields and their validation rules.
 * 
 * @returns {Response} JSON response with registration information
 */
export async function GET() {
  return NextResponse.json({
    message: "Mentor registration endpoint with complete onboarding",
    methods: ["POST"],
    requiredFields: {
      part1_personalInfo: {
        fullName: "string (required)",
        age: "number (18-80, required)",
        email: "string (valid email, required)",
        contactNumber: "string (required)",
        password: "string (min 6 chars, required)",
        preferredLanguage: "string (English, Sinhala, Tamil, Other, required)",
        currentLocation: "string (required)",
        bio: "string (2-3 sentences, required)",
        professionalRole: "string (required)",
      },
      part2_areasOfExpertise: {
        subjectsToTeach: "string[] (required, at least one)",
        teachingExperience: "string (None, 1-3 years, 3-5 years, 5+ years, required)",
        preferredStudentLevels: "string[] (Grade 3-5, Grade 6-9, Grade 10-11, Advanced Level, required)",
      },
      part3_socialProfessionalLinks: {
        linkedinProfile: "string (valid LinkedIn URL, required)",
        githubPortfolio: "string (valid URL, optional)",
        profilePictureUrl: "string (valid image URL, optional)",
      },
    },
    validationRules: {
      age: "Must be between 18 and 80",
      email: "Must be valid email format",
      password: "Minimum 6 characters",
      linkedinProfile: "Must be valid LinkedIn profile URL",
      githubPortfolio: "Must be valid URL if provided",
    },
  })
}

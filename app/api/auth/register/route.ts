import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import type { EducationLevel, LearningStyle, SkillLevel } from "@/lib/generated/prisma"

/**
 * Interface for unified registration supporting all user types
 */
interface UnifiedRegistrationData {
  userType: 'STUDENT' | 'MENTOR' | 'BASIC'
  
  // Basic fields (required for all)
  fullName?: string
  name?: string // For backward compatibility
  age?: number
  email: string
  password: string
  contactNumber?: string
  
  // Student-specific fields
  currentEducationLevel?: EducationLevel
  school?: string
  subjectsOfInterest?: string[]
  currentYear?: number
  subjectSkills?: Array<{
    subjectName: string
    skillLevel: SkillLevel
  }>
  preferredLearningStyle?: LearningStyle
  hasLearningDisabilities?: boolean
  learningAccommodations?: string
  
  // Mentor-specific fields
  preferredLanguage?: string
  currentLocation?: string
  bio?: string
  professionalRole?: string
  subjectsToTeach?: string[]
  teachingExperience?: string
  preferredStudentLevels?: string[]
  linkedinProfile?: string
  githubPortfolio?: string
  profilePictureUrl?: string
}

/**
 * POST /api/auth/unified-register
 * 
 * Unified registration endpoint supporting all user types.
 * Handles BASIC, STUDENT, and MENTOR registration with appropriate validation.
 * 
 * @param {Request} request - Registration data with userType field
 * @returns {Response} JSON response with user data or error message
 * 
 * @example
 * // Basic user registration:
 * {
 *   "userType": "BASIC",
 *   "name": "John Doe",
 *   "email": "john@example.com",
 *   "password": "password123"
 * }
 * 
 * // Student registration:
 * {
 *   "userType": "STUDENT",
 *   "fullName": "Jane Smith",
 *   "age": 16,
 *   "email": "jane@example.com",
 *   "password": "password123",
 *   "currentEducationLevel": "ORDINARY_LEVEL",
 *   "school": "City High School",
 *   "subjectsOfInterest": ["Math", "Physics"]
 * }
 */
export async function POST(request: Request) {
  try {
    const body: UnifiedRegistrationData = await request.json()
    const { userType = 'BASIC', email, password } = body

    // Basic validation
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      )
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      )
    }

    // Password validation
    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters long" },
        { status: 400 }
      )
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 409 }
      )
    }

    // Route to appropriate registration handler
    switch (userType.toUpperCase()) {
      case 'STUDENT':
        return await registerStudent(body)
      case 'MENTOR':
        return await registerMentor(body)
      case 'BASIC':
      default:
        return await registerBasicUser(body)
    }

  } catch (error) {
    console.error("UNIFIED_REGISTRATION_ERROR", error)
    return NextResponse.json(
      { error: "Registration failed" },
      { status: 500 }
    )
  }
}

/**
 * Register a basic user with minimal information
 */
async function registerBasicUser(data: UnifiedRegistrationData) {
  const { name, fullName, email, password } = data
  const displayName = fullName || name

  if (!displayName) {
    return NextResponse.json(
      { error: "Name is required for basic registration" },
      { status: 400 }
    )
  }

  const hashedPassword = await bcrypt.hash(password, 12)

  const user = await prisma.user.create({
    data: {
      name: displayName,
      fullName: displayName,
      email,
      password: hashedPassword,
      role: "STUDENT", // Default role
    },
    select: {
      id: true,
      name: true,
      fullName: true,
      email: true,
      role: true,
      createdAt: true,
    }
  })

  return NextResponse.json({
    message: "User registered successfully",
    user
  }, { status: 201 })
}

/**
 * Register a student with comprehensive onboarding data
 */
async function registerStudent(data: UnifiedRegistrationData) {
  const {
    fullName, age, email, password, contactNumber,
    currentEducationLevel, school, subjectsOfInterest,
    currentYear, subjectSkills, preferredLearningStyle,
    hasLearningDisabilities, learningAccommodations
  } = data

  // Student-specific validation
  if (!fullName || !age || !currentEducationLevel || !school || !subjectsOfInterest || !currentYear || !preferredLearningStyle) {
    return NextResponse.json(
      { error: "Missing required fields for student registration" },
      { status: 400 }
    )
  }

  if (age < 13 || age > 25) {
    return NextResponse.json(
      { error: "Age must be between 13 and 25 for students" },
      { status: 400 }
    )
  }

  const hashedPassword = await bcrypt.hash(password, 12)

  const result = await prisma.$transaction(async (tx) => {
    const user = await tx.user.create({
      data: {
        fullName,
        name: fullName,
        age,
        email,
        contactNumber,
        password: hashedPassword,
        role: "STUDENT",
      }
    })

    const student = await tx.student.create({
      data: {
        userId: user.id,
        currentEducationLevel,
        school,
        subjectsOfInterest: subjectsOfInterest.join(", "),
        currentYear,
        preferredLearningStyle,
        hasLearningDisabilities: hasLearningDisabilities || false,
        learningAccommodations: learningAccommodations || null,
        onboardingCompleted: true,
        onboardingStep: 3,
      }
    })

    // Create subject skills if provided
    if (subjectSkills && subjectSkills.length > 0) {
      await tx.subjectSkill.createMany({
        data: subjectSkills.map(skill => ({
          studentId: student.id,
          subjectName: skill.subjectName,
          skillLevel: skill.skillLevel,
        }))
      })
    }

    return { user, student }
  })

  return NextResponse.json({
    message: "Student registered successfully",
    user: {
      id: result.user.id,
      fullName: result.user.fullName,
      email: result.user.email,
      role: result.user.role,
    }
  }, { status: 201 })
}

/**
 * Register a mentor with comprehensive onboarding data
 */
async function registerMentor(data: UnifiedRegistrationData) {
  const {
    fullName, age, email, password, contactNumber,
    preferredLanguage, currentLocation, bio, professionalRole,
    subjectsToTeach, teachingExperience, preferredStudentLevels,
    linkedinProfile, githubPortfolio, profilePictureUrl
  } = data

  // Mentor-specific validation
  if (!fullName || !age || !preferredLanguage || !currentLocation || !bio || !professionalRole ||
      !subjectsToTeach || !teachingExperience || !preferredStudentLevels || !linkedinProfile) {
    return NextResponse.json(
      { error: "Missing required fields for mentor registration" },
      { status: 400 }
    )
  }

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

  const hashedPassword = await bcrypt.hash(password, 12)

  const result = await prisma.$transaction(async (tx) => {
    const user = await tx.user.create({
      data: {
        fullName,
        name: fullName,
        age,
        email,
        contactNumber,
        password: hashedPassword,
        role: "MENTOR",
      }
    })

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
        onboardingStep: 3,
      }
    })

    return { user, mentor }
  })

  return NextResponse.json({
    message: "Mentor registered successfully",
    user: {
      id: result.user.id,
      fullName: result.user.fullName,
      email: result.user.email,
      role: result.user.role,
    }
  }, { status: 201 })
}

/**
 * GET /api/auth/unified-register
 * 
 * Returns information about the unified registration endpoint
 */
export async function GET() {
  return NextResponse.json({
    message: "Unified registration endpoint",
    supportedUserTypes: ["BASIC", "STUDENT", "MENTOR"],
    methods: ["POST"],
    requiredFields: {
      all: ["email", "password", "userType"],
      basic: ["name"],
      student: ["fullName", "age", "currentEducationLevel", "school", "subjectsOfInterest", "currentYear", "preferredLearningStyle"],
      mentor: ["fullName", "age", "preferredLanguage", "currentLocation", "bio", "professionalRole", "subjectsToTeach", "teachingExperience", "preferredStudentLevels", "linkedinProfile"]
    }
  })
}

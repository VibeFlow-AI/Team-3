import { NextResponse } from "next/server"
import { PrismaClient } from "@/lib/generated/prisma"
import bcrypt from "bcryptjs"
import type { EducationLevel, LearningStyle, SkillLevel } from "@/lib/generated/prisma"

const prisma = new PrismaClient()

/**
 * Interface for complete student registration with onboarding
 */
interface StudentRegistrationData {
  // Part 1: Basic Information
  fullName: string
  age: number
  email: string
  contactNumber: string
  password: string
  
  // Part 2: Academic Background
  currentEducationLevel: EducationLevel
  school: string
  
  // Part 3: Subject & Skill Assessment
  subjectsOfInterest: string[] // Array of subjects
  currentYear: number
  subjectSkills: Array<{
    subjectName: string
    skillLevel: SkillLevel
  }>
  preferredLearningStyle: LearningStyle
  hasLearningDisabilities: boolean
  learningAccommodations?: string
}

/**
 * POST /api/auth/student/register
 * 
 * Handles complete student registration with multi-part onboarding data.
 * Creates a new student account with comprehensive profile information.
 * 
 * @param {Request} request - The incoming request containing student registration and onboarding data
 * @returns {Response} JSON response with user data or error message
 * 
 * @example
 * // Request body:
 * {
 *   "fullName": "John Doe",
 *   "age": 16,
 *   "email": "john@example.com",
 *   "contactNumber": "+1234567890",
 *   "password": "securePassword123",
 *   "currentEducationLevel": "ORDINARY_LEVEL",
 *   "school": "City High School",
 *   "subjectsOfInterest": ["Mathematics", "Physics", "Computer Science"],
 *   "currentYear": 11,
 *   "subjectSkills": [
 *     { "subjectName": "Mathematics", "skillLevel": "INTERMEDIATE" },
 *     { "subjectName": "Physics", "skillLevel": "BEGINNER" }
 *   ],
 *   "preferredLearningStyle": "VISUAL",
 *   "hasLearningDisabilities": false
 * }
 * 
 * // Success response:
 * {
 *   "message": "Student registered successfully",
 *   "user": {
 *     "id": "clh1234567890",
 *     "fullName": "John Doe",
 *     "email": "john@example.com",
 *     "role": "STUDENT"
 *   }
 * }
 */
export async function POST(request: Request) {
  try {
    const body: StudentRegistrationData = await request.json()
    
    const {
      // Part 1: Basic Information
      fullName,
      age,
      email,
      contactNumber,
      password,
      
      // Part 2: Academic Background
      currentEducationLevel,
      school,
      
      // Part 3: Subject & Skill Assessment
      subjectsOfInterest,
      currentYear,
      subjectSkills,
      preferredLearningStyle,
      hasLearningDisabilities,
      learningAccommodations,
    } = body

    // --- VALIDATION ---
    
    // Part 1 validation
    if (!fullName || !age || !email || !contactNumber || !password) {
      return NextResponse.json(
        { error: "Missing required basic information fields" },
        { status: 400 }
      )
    }

    // Part 2 validation
    if (!currentEducationLevel || !school) {
      return NextResponse.json(
        { error: "Missing required academic background fields" },
        { status: 400 }
      )
    }

    // Part 3 validation
    if (!subjectsOfInterest || !currentYear || !preferredLearningStyle) {
      return NextResponse.json(
        { error: "Missing required subject and skill assessment fields" },
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

    // Age validation
    if (age < 13 || age > 25) {
      return NextResponse.json(
        { error: "Age must be between 13 and 25" },
        { status: 400 }
      )
    }

    // Current year validation
    if (currentYear < 1 || currentYear > 13) {
      return NextResponse.json(
        { error: "Current year must be between 1 and 13" },
        { status: 400 }
      )
    }

    // Validate subject skills
    if (subjectSkills && subjectSkills.length > 0) {
      const validSkillLevels = ['BEGINNER', 'INTERMEDIATE', 'ADVANCED']
      for (const skill of subjectSkills) {
        if (!skill.subjectName || !skill.skillLevel) {
          return NextResponse.json(
            { error: "Each subject skill must have a name and level" },
            { status: 400 }
          )
        }
        if (!validSkillLevels.includes(skill.skillLevel)) {
          return NextResponse.json(
            { error: "Invalid skill level. Must be BEGINNER, INTERMEDIATE, or ADVANCED" },
            { status: 400 }
          )
        }
      }
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

    // --- CREATE USER AND STUDENT PROFILE IN TRANSACTION ---
    const result = await prisma.$transaction(async (tx) => {
      // Create user with basic information
      const user = await tx.user.create({
        data: {
          fullName,
          age,
          email,
          contactNumber,
          name: fullName, // Also set the name field for compatibility
          password: hashedPassword,
          role: "STUDENT",
        },
      })

      // Create student profile with academic and skill information
      const student = await tx.student.create({
        data: {
          userId: user.id,
          currentEducationLevel,
          school,
          subjectsOfInterest: subjectsOfInterest.join(", "),
          currentYear,
          preferredLearningStyle,
          hasLearningDisabilities,
          learningAccommodations: learningAccommodations || null,
          onboardingCompleted: true,
          onboardingStep: 3, // Completed all steps
        },
      })

      // Create subject skill records if provided
      if (subjectSkills && subjectSkills.length > 0) {
        await tx.subjectSkill.createMany({
          data: subjectSkills.map(skill => ({
            studentId: student.id,
            subjectName: skill.subjectName,
            skillLevel: skill.skillLevel,
          })),
        })
      }

      return { user, student }
    })

    // Return user data (excluding password for security)
    return NextResponse.json(
      {
        message: "Student registered successfully with complete profile",
        user: {
          id: result.user.id,
          fullName: result.user.fullName,
          email: result.user.email,
          role: result.user.role,
          age: result.user.age,
          contactNumber: result.user.contactNumber,
        },
        student: {
          id: result.student.id,
          currentEducationLevel: result.student.currentEducationLevel,
          school: result.student.school,
          subjectsOfInterest: result.student.subjectsOfInterest?.split(", ") || [],
          currentYear: result.student.currentYear,
          preferredLearningStyle: result.student.preferredLearningStyle,
          hasLearningDisabilities: result.student.hasLearningDisabilities,
          onboardingCompleted: result.student.onboardingCompleted,
        },
      },
      { status: 201 }
    )

  } catch (error) {
    console.error("STUDENT_REGISTRATION_ERROR", error)
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    )
  }
}

/**
 * GET /api/auth/student/register
 * 
 * Returns information about the student registration endpoint.
 * Includes all required fields and their validation rules.
 * 
 * @returns {Response} JSON response with registration information
 */
export async function GET() {
  return NextResponse.json({
    message: "Student registration endpoint with complete onboarding",
    methods: ["POST"],
    requiredFields: {
      part1_basicInfo: {
        fullName: "string (required)",
        age: "number (13-25, required)",
        email: "string (valid email, required)",
        contactNumber: "string (required)",
        password: "string (min 6 chars, required)",
      },
      part2_academicBackground: {
        currentEducationLevel: "enum (GRADE_9, ORDINARY_LEVEL, ADVANCED_LEVEL, required)",
        school: "string (required)",
      },
      part3_subjectSkillAssessment: {
        subjectsOfInterest: "string[] (required)",
        currentYear: "number (1-13, required)",
        subjectSkills: "array of {subjectName: string, skillLevel: BEGINNER|INTERMEDIATE|ADVANCED}",
        preferredLearningStyle: "enum (VISUAL, HANDS_ON, THEORETICAL, MIXED, required)",
        hasLearningDisabilities: "boolean (required)",
        learningAccommodations: "string (optional, required if hasLearningDisabilities is true)",
      },
    },
    enums: {
      EducationLevel: ["GRADE_9", "ORDINARY_LEVEL", "ADVANCED_LEVEL"],
      SkillLevel: ["BEGINNER", "INTERMEDIATE", "ADVANCED"],
      LearningStyle: ["VISUAL", "HANDS_ON", "THEORETICAL", "MIXED"],
    },
  })
}

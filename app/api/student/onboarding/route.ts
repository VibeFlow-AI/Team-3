import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

/**
 * GET /api/student/onboarding
 * 
 * Gets the current student's onboarding status and data.
 * Returns comprehensive onboarding information for the authenticated student.
 * 
 * @returns {Response} JSON response with onboarding status and data
 */
export async function GET() {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      )
    }

    // Get user and student data with subject skills
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        student: {
          include: {
            subjectSkills: {
              orderBy: { subjectName: 'asc' }
            },
          },
        },
      },
    })

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      )
    }

    // Check if user is a student
    if (user.role !== 'STUDENT') {
      return NextResponse.json(
        { error: "Access denied. Student role required." },
        { status: 403 }
      )
    }

    // Prepare response data
    const responseData = {
      onboardingStatus: {
        isCompleted: user.student?.onboardingCompleted || false,
        currentStep: user.student?.onboardingStep || 1,
        totalSteps: 3,
      },
      part1_basicInfo: {
        fullName: user.fullName,
        age: user.age,
        email: user.email,
        contactNumber: user.contactNumber,
        completed: !!(user.fullName && user.age && user.email && user.contactNumber),
      },
      part2_academicBackground: user.student ? {
        currentEducationLevel: user.student.currentEducationLevel,
        school: user.student.school,
        completed: !!(user.student.currentEducationLevel && user.student.school),
      } : {
        currentEducationLevel: null,
        school: null,
        completed: false,
      },
      part3_subjectSkillAssessment: user.student ? {
        subjectsOfInterest: user.student.subjectsOfInterest?.split(", ") || [],
        currentYear: user.student.currentYear,
        preferredLearningStyle: user.student.preferredLearningStyle,
        hasLearningDisabilities: user.student.hasLearningDisabilities,
        learningAccommodations: user.student.learningAccommodations,
        subjectSkills: user.student.subjectSkills.map(skill => ({
          subjectName: skill.subjectName,
          skillLevel: skill.skillLevel,
        })),
        completed: !!(
          user.student.subjectsOfInterest &&
          user.student.currentYear &&
          user.student.preferredLearningStyle !== undefined &&
          user.student.hasLearningDisabilities !== undefined
        ),
      } : {
        subjectsOfInterest: [],
        currentYear: null,
        preferredLearningStyle: null,
        hasLearningDisabilities: false,
        learningAccommodations: null,
        subjectSkills: [],
        completed: false,
      },
    }

    return NextResponse.json({
      success: true,
      data: responseData,
    })

  } catch (error) {
    console.error("Error fetching onboarding status:", error)
    return NextResponse.json(
      { error: "Failed to fetch onboarding status" },
      { status: 500 }
    )
  }
}

/**
 * POST /api/student/onboarding
 * 
 * Updates the student's onboarding data based on the provided step.
 * Supports partial updates for each step of the onboarding process.
 * 
 * @param {Request} request - Request containing step and data
 * @returns {Response} JSON response with update result
 * 
 * @example
 * // Part 1 update:
 * {
 *   "step": 1,
 *   "data": {
 *     "fullName": "John Doe",
 *     "age": 16,
 *     "email": "john@example.com",
 *     "contactNumber": "+1234567890"
 *   }
 * }
 * 
 * // Part 2 update:
 * {
 *   "step": 2,
 *   "data": {
 *     "currentEducationLevel": "ORDINARY_LEVEL",
 *     "school": "City High School"
 *   }
 * }
 * 
 * // Part 3 update:
 * {
 *   "step": 3,
 *   "data": {
 *     "subjectsOfInterest": ["Mathematics", "Physics"],
 *     "currentYear": 11,
 *     "subjectSkills": [
 *       { "subjectName": "Mathematics", "skillLevel": "INTERMEDIATE" }
 *     ],
 *     "preferredLearningStyle": "VISUAL",
 *     "hasLearningDisabilities": false
 *   }
 * }
 */
export async function POST(request: Request) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { step, data } = body

    if (!step || !data) {
      return NextResponse.json(
        { error: "Step and data are required" },
        { status: 400 }
      )
    }

    // Validate step number
    if (step < 1 || step > 3) {
      return NextResponse.json(
        { error: "Invalid step. Must be 1, 2, or 3" },
        { status: 400 }
      )
    }

    // Handle different steps
    switch (step) {
      case 1: {
        // Part 1: Basic Information
        const { fullName, age, email, contactNumber } = data

        if (!fullName || !age || !email || !contactNumber) {
          return NextResponse.json(
            { error: "Missing required fields for Part 1" },
            { status: 400 }
          )
        }

        // Update user basic information
        await prisma.user.update({
          where: { id: session.user.id },
          data: {
            fullName,
            age: parseInt(age),
            email,
            contactNumber,
          },
        })

        // Create or update student record with step progression
        await prisma.student.upsert({
          where: { userId: session.user.id },
          update: {
            onboardingStep: Math.max(2, (await prisma.student.findUnique({ where: { userId: session.user.id } }))?.onboardingStep || 1),
          },
          create: {
            userId: session.user.id,
            onboardingStep: 2,
          },
        })

        return NextResponse.json({
          success: true,
          message: "Part 1 completed successfully",
          nextStep: 2,
        })
      }

      case 2: {
        // Part 2: Academic Background
        const { currentEducationLevel, school } = data

        if (!currentEducationLevel || !school) {
          return NextResponse.json(
            { error: "Missing required fields for Part 2" },
            { status: 400 }
          )
        }

        // Update student academic information
        await prisma.student.upsert({
          where: { userId: session.user.id },
          update: {
            currentEducationLevel,
            school,
            onboardingStep: Math.max(3, (await prisma.student.findUnique({ where: { userId: session.user.id } }))?.onboardingStep || 1),
          },
          create: {
            userId: session.user.id,
            currentEducationLevel,
            school,
            onboardingStep: 3,
          },
        })

        return NextResponse.json({
          success: true,
          message: "Part 2 completed successfully",
          nextStep: 3,
        })
      }

      case 3: {
        // Part 3: Subject & Skill Assessment
        const {
          subjectsOfInterest,
          currentYear,
          subjectSkills,
          preferredLearningStyle,
          hasLearningDisabilities,
          learningAccommodations,
        } = data

        if (!subjectsOfInterest || !currentYear || preferredLearningStyle === undefined || hasLearningDisabilities === undefined) {
          return NextResponse.json(
            { error: "Missing required fields for Part 3" },
            { status: 400 }
          )
        }

        // Use transaction for consistency
        await prisma.$transaction(async (tx) => {
          // Update student with subject and skill information
          await tx.student.upsert({
            where: { userId: session.user.id },
            update: {
              subjectsOfInterest: Array.isArray(subjectsOfInterest) ? subjectsOfInterest.join(", ") : subjectsOfInterest,
              currentYear: parseInt(currentYear),
              preferredLearningStyle,
              hasLearningDisabilities,
              learningAccommodations: learningAccommodations || null,
              onboardingCompleted: true,
              onboardingStep: 3,
            },
            create: {
              userId: session.user.id,
              subjectsOfInterest: Array.isArray(subjectsOfInterest) ? subjectsOfInterest.join(", ") : subjectsOfInterest,
              currentYear: parseInt(currentYear),
              preferredLearningStyle,
              hasLearningDisabilities,
              learningAccommodations: learningAccommodations || null,
              onboardingCompleted: true,
              onboardingStep: 3,
            },
          })

          // Get student ID for subject skills
          const student = await tx.student.findUnique({
            where: { userId: session.user.id },
          })

          if (!student) {
            throw new Error("Student record not found")
          }

          // Delete existing subject skills
          await tx.subjectSkill.deleteMany({
            where: { studentId: student.id },
          })

          // Create new subject skills if provided
          if (subjectSkills && Array.isArray(subjectSkills) && subjectSkills.length > 0) {
            await tx.subjectSkill.createMany({
              data: subjectSkills.map((skill: any) => ({
                studentId: student.id,
                subjectName: skill.subjectName,
                skillLevel: skill.skillLevel,
              })),
            })
          }
        })

        return NextResponse.json({
          success: true,
          message: "Onboarding completed successfully!",
          nextStep: null, // Completed
        })
      }

      default:
        return NextResponse.json(
          { error: "Invalid step" },
          { status: 400 }
        )
    }

  } catch (error) {
    console.error("Error updating onboarding:", error)
    return NextResponse.json(
      { error: "Failed to update onboarding data" },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/student/onboarding
 * 
 * Resets the student's onboarding data (for testing or re-onboarding).
 * Removes all onboarding-related data but keeps the user account.
 * 
 * @returns {Response} JSON response with reset result
 */
export async function DELETE() {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      )
    }

    await prisma.$transaction(async (tx) => {
      // Reset user onboarding fields
      await tx.user.update({
        where: { id: session.user.id },
        data: {
          fullName: null,
          age: null,
          contactNumber: null,
        },
      })

      // Delete student profile and related data
      const student = await tx.student.findUnique({
        where: { userId: session.user.id },
      })

      if (student) {
        // Delete subject skills first (foreign key constraint)
        await tx.subjectSkill.deleteMany({
          where: { studentId: student.id },
        })

        // Delete student profile
        await tx.student.delete({
          where: { userId: session.user.id },
        })
      }
    })

    return NextResponse.json({
      success: true,
      message: "Onboarding reset successfully",
    })

  } catch (error) {
    console.error("Error resetting onboarding:", error)
    return NextResponse.json(
      { error: "Failed to reset onboarding" },
      { status: 500 }
    )
  }
}

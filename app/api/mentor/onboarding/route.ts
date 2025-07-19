import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

/**
 * GET /api/mentor/onboarding
 * 
 * Gets the current mentor's onboarding status and data.
 * Returns comprehensive onboarding information for the authenticated mentor.
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

    // Get user and mentor data
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        mentor: true,
      },
    })

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      )
    }

    // Check if user is a mentor
    if (user.role !== 'MENTOR') {
      return NextResponse.json(
        { error: "Access denied. Mentor role required." },
        { status: 403 }
      )
    }

    // Prepare response data
    const responseData = {
      onboardingStatus: {
        isCompleted: user.mentor?.onboardingCompleted || false,
        currentStep: user.mentor?.onboardingStep || 1,
        totalSteps: 3,
      },
      part1_personalInfo: {
        fullName: user.fullName,
        age: user.age,
        email: user.email,
        contactNumber: user.contactNumber,
        preferredLanguage: user.mentor?.preferredLanguage,
        currentLocation: user.mentor?.currentLocation,
        bio: user.mentor?.bio,
        professionalRole: user.mentor?.professionalRole,
        completed: !!(
          user.fullName && 
          user.age && 
          user.email && 
          user.contactNumber &&
          user.mentor?.preferredLanguage &&
          user.mentor?.currentLocation &&
          user.mentor?.bio &&
          user.mentor?.professionalRole
        ),
      },
      part2_areasOfExpertise: user.mentor ? {
        subjectsToTeach: user.mentor.subjectsToTeach?.split(", ") || [],
        teachingExperience: user.mentor.teachingExperience,
        preferredStudentLevels: user.mentor.preferredStudentLevels?.split(", ") || [],
        completed: !!(
          user.mentor.subjectsToTeach &&
          user.mentor.teachingExperience &&
          user.mentor.preferredStudentLevels
        ),
      } : {
        subjectsToTeach: [],
        teachingExperience: null,
        preferredStudentLevels: [],
        completed: false,
      },
      part3_socialProfessionalLinks: user.mentor ? {
        linkedinProfile: user.mentor.linkedinProfile,
        githubPortfolio: user.mentor.githubPortfolio,
        profilePictureUrl: user.mentor.profilePictureUrl,
        completed: !!(user.mentor.linkedinProfile), // LinkedIn is mandatory
      } : {
        linkedinProfile: null,
        githubPortfolio: null,
        profilePictureUrl: null,
        completed: false,
      },
    }

    return NextResponse.json({
      success: true,
      data: responseData,
    })

  } catch (error) {
    console.error("Error fetching mentor onboarding status:", error)
    return NextResponse.json(
      { error: "Failed to fetch onboarding status" },
      { status: 500 }
    )
  }
}

/**
 * POST /api/mentor/onboarding
 * 
 * Updates the mentor's onboarding data based on the provided step.
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
 *     "fullName": "Dr. Jane Smith",
 *     "age": 35,
 *     "email": "jane@university.edu",
 *     "contactNumber": "+1234567890",
 *     "preferredLanguage": "English",
 *     "currentLocation": "Colombo, Sri Lanka",
 *     "bio": "Experienced physics teacher...",
 *     "professionalRole": "Senior Physics Lecturer"
 *   }
 * }
 * 
 * // Part 2 update:
 * {
 *   "step": 2,
 *   "data": {
 *     "subjectsToTeach": ["Physics", "Mathematics"],
 *     "teachingExperience": "5+ years",
 *     "preferredStudentLevels": ["Grade 10-11", "Advanced Level"]
 *   }
 * }
 * 
 * // Part 3 update:
 * {
 *   "step": 3,
 *   "data": {
 *     "linkedinProfile": "https://linkedin.com/in/janesmith",
 *     "githubPortfolio": "https://github.com/janesmith",
 *     "profilePictureUrl": "https://example.com/profile.jpg"
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

    const { step, data } = await request.json()

    if (!step || !data) {
      return NextResponse.json(
        { error: "Step and data are required" },
        { status: 400 }
      )
    }

    // Check if user is a mentor
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { mentor: true },
    })

    if (!user || user.role !== 'MENTOR') {
      return NextResponse.json(
        { error: "Access denied. Mentor role required." },
        { status: 403 }
      )
    }

    switch (step) {
      case 1: {
        // Part 1: Personal Information
        const {
          fullName,
          age,
          email,
          contactNumber,
          preferredLanguage,
          currentLocation,
          bio,
          professionalRole,
        } = data

        if (!fullName || !age || !email || !contactNumber || !preferredLanguage || !currentLocation || !bio || !professionalRole) {
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

        // Create or update mentor record with personal information
        await prisma.mentor.upsert({
          where: { userId: session.user.id },
          update: {
            preferredLanguage,
            currentLocation,
            bio,
            professionalRole,
            onboardingStep: Math.max(2, (await prisma.mentor.findUnique({ where: { userId: session.user.id } }))?.onboardingStep || 1),
          },
          create: {
            userId: session.user.id,
            preferredLanguage,
            currentLocation,
            bio,
            professionalRole,
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
        // Part 2: Areas of Expertise
        const { subjectsToTeach, teachingExperience, preferredStudentLevels } = data

        if (!subjectsToTeach || subjectsToTeach.length === 0 || !teachingExperience || !preferredStudentLevels || preferredStudentLevels.length === 0) {
          return NextResponse.json(
            { error: "Missing required fields for Part 2" },
            { status: 400 }
          )
        }

        // Update mentor with expertise information
        await prisma.mentor.upsert({
          where: { userId: session.user.id },
          update: {
            subjectsToTeach: Array.isArray(subjectsToTeach) ? subjectsToTeach.join(", ") : subjectsToTeach,
            teachingExperience,
            preferredStudentLevels: Array.isArray(preferredStudentLevels) ? preferredStudentLevels.join(", ") : preferredStudentLevels,
            onboardingStep: Math.max(3, (await prisma.mentor.findUnique({ where: { userId: session.user.id } }))?.onboardingStep || 1),
          },
          create: {
            userId: session.user.id,
            subjectsToTeach: Array.isArray(subjectsToTeach) ? subjectsToTeach.join(", ") : subjectsToTeach,
            teachingExperience,
            preferredStudentLevels: Array.isArray(preferredStudentLevels) ? preferredStudentLevels.join(", ") : preferredStudentLevels,
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
        // Part 3: Social & Professional Links
        const { linkedinProfile, githubPortfolio, profilePictureUrl } = data

        if (!linkedinProfile) {
          return NextResponse.json(
            { error: "LinkedIn profile is required" },
            { status: 400 }
          )
        }

        // Validate LinkedIn URL
        const linkedinRegex = /^https?:\/\/(www\.)?linkedin\.com\/in\/[a-zA-Z0-9-]+\/?$/
        if (!linkedinRegex.test(linkedinProfile)) {
          return NextResponse.json(
            { error: "Please provide a valid LinkedIn profile URL" },
            { status: 400 }
          )
        }

        // Validate GitHub/Portfolio URL if provided
        if (githubPortfolio) {
          const urlRegex = /^https?:\/\/.+$/
          if (!urlRegex.test(githubPortfolio)) {
            return NextResponse.json(
              { error: "Please provide a valid GitHub or portfolio URL" },
              { status: 400 }
            )
          }
        }

        // Update mentor with social and professional links
        await prisma.mentor.upsert({
          where: { userId: session.user.id },
          update: {
            linkedinProfile,
            githubPortfolio: githubPortfolio || null,
            profilePictureUrl: profilePictureUrl || null,
            onboardingCompleted: true,
            onboardingStep: 3,
          },
          create: {
            userId: session.user.id,
            linkedinProfile,
            githubPortfolio: githubPortfolio || null,
            profilePictureUrl: profilePictureUrl || null,
            onboardingCompleted: true,
            onboardingStep: 3,
          },
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
    console.error("Error updating mentor onboarding:", error)
    return NextResponse.json(
      { error: "Failed to update onboarding data" },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/mentor/onboarding
 * 
 * Resets the mentor's onboarding data (for testing or re-onboarding).
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

      // Delete mentor profile
      await tx.mentor.deleteMany({
        where: { userId: session.user.id },
      })
    })

    return NextResponse.json({
      success: true,
      message: "Mentor onboarding data reset successfully",
    })

  } catch (error) {
    console.error("Error resetting mentor onboarding:", error)
    return NextResponse.json(
      { error: "Failed to reset onboarding data" },
      { status: 500 }
    )
  }
}

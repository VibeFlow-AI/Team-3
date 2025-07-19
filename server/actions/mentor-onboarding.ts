"use server"

import { revalidatePath } from "next/cache"
import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"

/**
 * Interface for Part 1: Personal Information
 */
interface MentorOnboardingPart1Data {
  fullName: string
  age: number
  email: string
  contactNumber: string
  preferredLanguage: string // English, Sinhala, Tamil, Other
  currentLocation: string
  bio: string // Short bio (2-3 sentences)
  professionalRole: string
}

/**
 * Interface for Part 2: Areas of Expertise
 */
interface MentorOnboardingPart2Data {
  subjectsToTeach: string[] // Array of subjects to teach
  teachingExperience: string // None, 1-3 years, 3-5 years, 5+ years
  preferredStudentLevels: string[] // Array of levels
}

/**
 * Interface for Part 3: Social & Professional Links
 */
interface MentorOnboardingPart3Data {
  linkedinProfile: string // LinkedIn URL (mandatory)
  githubPortfolio?: string // GitHub or Portfolio URL (optional)
  profilePictureUrl?: string // Profile picture URL
}

/**
 * Complete mentor onboarding - saves all parts at once
 */
interface CompleteMentorOnboardingData extends MentorOnboardingPart1Data, MentorOnboardingPart2Data, MentorOnboardingPart3Data {}

/**
 * Server Action: Save Part 1 of mentor onboarding (Personal Information)
 * 
 * @param data - Personal information including name, age, language, location, bio, role
 * @returns Success response or error
 */
export async function saveMentorOnboardingPart1(data: MentorOnboardingPart1Data) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return { error: "Not authenticated" }
    }

    // Update user basic information
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        fullName: data.fullName,
        age: data.age,
        email: data.email,
        contactNumber: data.contactNumber,
      },
    })

    // Create or update mentor profile with personal information
    await prisma.mentor.upsert({
      where: { userId: session.user.id },
      update: {
        preferredLanguage: data.preferredLanguage,
        currentLocation: data.currentLocation,
        bio: data.bio,
        professionalRole: data.professionalRole,
        onboardingStep: 2, // Move to part 2
      },
      create: {
        userId: session.user.id,
        preferredLanguage: data.preferredLanguage,
        currentLocation: data.currentLocation,
        bio: data.bio,
        professionalRole: data.professionalRole,
        onboardingStep: 2,
      },
    })

    revalidatePath("/mentor/onboarding")
    return { success: true, message: "Part 1 completed successfully" }

  } catch (error) {
    console.error("Error saving mentor onboarding part 1:", error)
    return { error: "Failed to save personal information" }
  }
}

/**
 * Server Action: Save Part 2 of mentor onboarding (Areas of Expertise)
 * 
 * @param data - Expertise including subjects, experience, and preferred student levels
 * @returns Success response or error
 */
export async function saveMentorOnboardingPart2(data: MentorOnboardingPart2Data) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return { error: "Not authenticated" }
    }

    // Update mentor profile with expertise information
    await prisma.mentor.upsert({
      where: { userId: session.user.id },
      update: {
        subjectsToTeach: data.subjectsToTeach.join(", "),
        teachingExperience: data.teachingExperience,
        preferredStudentLevels: data.preferredStudentLevels.join(", "),
        onboardingStep: 3, // Move to part 3
      },
      create: {
        userId: session.user.id,
        subjectsToTeach: data.subjectsToTeach.join(", "),
        teachingExperience: data.teachingExperience,
        preferredStudentLevels: data.preferredStudentLevels.join(", "),
        onboardingStep: 3,
      },
    })

    revalidatePath("/mentor/onboarding")
    return { success: true, message: "Part 2 completed successfully" }

  } catch (error) {
    console.error("Error saving mentor onboarding part 2:", error)
    return { error: "Failed to save expertise information" }
  }
}

/**
 * Server Action: Save Part 3 of mentor onboarding (Social & Professional Links)
 * 
 * @param data - Social and professional links
 * @returns Success response or error
 */
export async function saveMentorOnboardingPart3(data: MentorOnboardingPart3Data) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return { error: "Not authenticated" }
    }

    // Validate LinkedIn URL
    const linkedinRegex = /^https?:\/\/(www\.)?linkedin\.com\/in\/[a-zA-Z0-9-]+\/?$/
    if (!linkedinRegex.test(data.linkedinProfile)) {
      return { error: "Please provide a valid LinkedIn profile URL" }
    }

    // Validate GitHub/Portfolio URL if provided
    if (data.githubPortfolio) {
      const urlRegex = /^https?:\/\/.+$/
      if (!urlRegex.test(data.githubPortfolio)) {
        return { error: "Please provide a valid GitHub or portfolio URL" }
      }
    }

    // Update mentor profile with social and professional links
    await prisma.mentor.upsert({
      where: { userId: session.user.id },
      update: {
        linkedinProfile: data.linkedinProfile,
        githubPortfolio: data.githubPortfolio || null,
        profilePictureUrl: data.profilePictureUrl || null,
        onboardingCompleted: true,
        onboardingStep: 3, // Completed
      },
      create: {
        userId: session.user.id,
        linkedinProfile: data.linkedinProfile,
        githubPortfolio: data.githubPortfolio || null,
        profilePictureUrl: data.profilePictureUrl || null,
        onboardingCompleted: true,
        onboardingStep: 3,
      },
    })

    revalidatePath("/mentor/onboarding")
    return { success: true, message: "Onboarding completed successfully!" }

  } catch (error) {
    console.error("Error saving mentor onboarding part 3:", error)
    return { error: "Failed to save social and professional links" }
  }
}

/**
 * Server Action: Save complete mentor onboarding (all parts at once)
 * 
 * @param data - Complete onboarding data
 * @returns Success response or error
 */
export async function saveCompleteMentorOnboarding(data: CompleteMentorOnboardingData) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return { error: "Not authenticated" }
    }

    // Use transaction to ensure all data is saved consistently
    await prisma.$transaction(async (tx) => {
      // Update user basic information
      await tx.user.update({
        where: { id: session.user.id },
        data: {
          fullName: data.fullName,
          age: data.age,
          email: data.email,
          contactNumber: data.contactNumber,
        },
      })

      // Create or update complete mentor profile
      await tx.mentor.upsert({
        where: { userId: session.user.id },
        update: {
          preferredLanguage: data.preferredLanguage,
          currentLocation: data.currentLocation,
          bio: data.bio,
          professionalRole: data.professionalRole,
          subjectsToTeach: data.subjectsToTeach.join(", "),
          teachingExperience: data.teachingExperience,
          preferredStudentLevels: data.preferredStudentLevels.join(", "),
          linkedinProfile: data.linkedinProfile,
          githubPortfolio: data.githubPortfolio || null,
          profilePictureUrl: data.profilePictureUrl || null,
          onboardingCompleted: true,
          onboardingStep: 3,
        },
        create: {
          userId: session.user.id,
          preferredLanguage: data.preferredLanguage,
          currentLocation: data.currentLocation,
          bio: data.bio,
          professionalRole: data.professionalRole,
          subjectsToTeach: data.subjectsToTeach.join(", "),
          teachingExperience: data.teachingExperience,
          preferredStudentLevels: data.preferredStudentLevels.join(", "),
          linkedinProfile: data.linkedinProfile,
          githubPortfolio: data.githubPortfolio || null,
          profilePictureUrl: data.profilePictureUrl || null,
          onboardingCompleted: true,
          onboardingStep: 3,
        },
      })
    })

    revalidatePath("/mentor/onboarding")
    return { success: true, message: "Complete mentor onboarding saved successfully" }

  } catch (error) {
    console.error("Error saving complete mentor onboarding:", error)
    return { error: "Failed to save complete onboarding data" }
  }
}

/**
 * Server Action: Get current mentor onboarding status and data
 * 
 * @returns Current mentor onboarding data or error
 */
export async function getMentorOnboardingStatus() {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return { error: "Not authenticated" }
    }

    // Get user and mentor data
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        mentor: true,
      },
    })

    if (!user) {
      return { error: "User not found" }
    }

    return {
      success: true,
      data: {
        user: {
          fullName: user.fullName,
          age: user.age,
          email: user.email,
          contactNumber: user.contactNumber,
        },
        mentor: user.mentor ? {
          preferredLanguage: user.mentor.preferredLanguage,
          currentLocation: user.mentor.currentLocation,
          bio: user.mentor.bio,
          professionalRole: user.mentor.professionalRole,
          subjectsToTeach: user.mentor.subjectsToTeach?.split(", ") || [],
          teachingExperience: user.mentor.teachingExperience,
          preferredStudentLevels: user.mentor.preferredStudentLevels?.split(", ") || [],
          linkedinProfile: user.mentor.linkedinProfile,
          githubPortfolio: user.mentor.githubPortfolio,
          profilePictureUrl: user.mentor.profilePictureUrl,
          onboardingCompleted: user.mentor.onboardingCompleted,
          onboardingStep: user.mentor.onboardingStep,
        } : null,
      },
    }

  } catch (error) {
    console.error("Error getting mentor onboarding status:", error)
    return { error: "Failed to get onboarding status" }
  }
}

/**
 * Server Action: Reset mentor onboarding (for testing or re-onboarding)
 * 
 * @returns Success response or error
 */
export async function resetMentorOnboarding() {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return { error: "Not authenticated" }
    }

    await prisma.$transaction(async (tx) => {
      // Reset user fields
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

    revalidatePath("/mentor/onboarding")
    return { success: true, message: "Mentor onboarding data reset successfully" }

  } catch (error) {
    console.error("Error resetting mentor onboarding:", error)
    return { error: "Failed to reset onboarding data" }
  }
}

/**
 * Get mentor profile with state persistence
 * @param userId - User ID to get profile for
 * @returns Mentor profile data with state
 */
export async function getMentorProfileWithState(userId?: string) {
  try {
    const session = await auth()
    const targetUserId = userId || session?.user?.id
    
    if (!targetUserId) {
      return { error: "User ID required" }
    }

    const user = await prisma.user.findUnique({
      where: { id: targetUserId },
      include: {
        mentor: true,
      },
    })

    if (!user || !user.mentor) {
      return { error: "Mentor profile not found" }
    }

    // Return profile with state persistence format
    return {
      success: true,
      profile: {
        // Part 1: Personal Information
        personalInfo: {
          fullName: user.fullName,
          age: user.age,
          email: user.email,
          contactNumber: user.contactNumber,
          preferredLanguage: user.mentor.preferredLanguage,
          currentLocation: user.mentor.currentLocation,
          bio: user.mentor.bio,
          professionalRole: user.mentor.professionalRole,
        },
        // Part 2: Areas of Expertise
        expertise: {
          subjectsToTeach: user.mentor.subjectsToTeach?.split(", ") || [],
          teachingExperience: user.mentor.teachingExperience,
          preferredStudentLevels: user.mentor.preferredStudentLevels?.split(", ") || [],
        },
        // Part 3: Social & Professional Links
        socialLinks: {
          linkedinProfile: user.mentor.linkedinProfile,
          githubPortfolio: user.mentor.githubPortfolio,
          profilePictureUrl: user.mentor.profilePictureUrl,
        },
        // State information
        onboarding: {
          completed: user.mentor.onboardingCompleted,
          currentStep: user.mentor.onboardingStep,
          lastUpdated: user.mentor.updatedAt,
        },
      },
    }

  } catch (error) {
    console.error("Error getting mentor profile with state:", error)
    return { error: "Failed to get mentor profile" }
  }
}

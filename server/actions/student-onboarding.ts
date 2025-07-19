"use server"

import { revalidatePath } from "next/cache"
import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import type { EducationLevel, LearningStyle, SkillLevel } from "@/lib/generated/prisma"

/**
 * Interface for Part 1: Basic Information
 */
interface OnboardingPart1Data {
  fullName: string
  age: number
  email: string
  contactNumber: string
}

/**
 * Interface for Part 2: Academic Background
 */
interface OnboardingPart2Data {
  currentEducationLevel: EducationLevel
  school: string
}

/**
 * Interface for Part 3: Subject & Skill Assessment
 */
interface SubjectSkillData {
  subjectName: string
  skillLevel: SkillLevel
}

interface OnboardingPart3Data {
  subjectsOfInterest: string[] // Array of subjects
  currentYear: number
  subjectSkills: SubjectSkillData[] // Skill level for each subject
  preferredLearningStyle: LearningStyle
  hasLearningDisabilities: boolean
  learningAccommodations?: string
}

/**
 * Complete student onboarding - saves all parts at once
 */
interface CompleteOnboardingData extends OnboardingPart1Data, OnboardingPart2Data, OnboardingPart3Data {}

/**
 * Server Action: Save Part 1 of student onboarding (Basic Information)
 * 
 * @param data - Basic information including name, age, email, contact
 * @returns Success response or error
 */
export async function saveOnboardingPart1(data: OnboardingPart1Data) {
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

    // Create or update student profile with step tracking
    await prisma.student.upsert({
      where: { userId: session.user.id },
      update: {
        onboardingStep: 2, // Move to part 2
      },
      create: {
        userId: session.user.id,
        onboardingStep: 2,
      },
    })

    revalidatePath("/student/onboarding")
    return { success: true, message: "Part 1 completed successfully" }

  } catch (error) {
    console.error("Error saving onboarding part 1:", error)
    return { error: "Failed to save basic information" }
  }
}

/**
 * Server Action: Save Part 2 of student onboarding (Academic Background)
 * 
 * @param data - Academic background including education level and school
 * @returns Success response or error
 */
export async function saveOnboardingPart2(data: OnboardingPart2Data) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return { error: "Not authenticated" }
    }

    // Update student profile with academic information
    await prisma.student.upsert({
      where: { userId: session.user.id },
      update: {
        currentEducationLevel: data.currentEducationLevel,
        school: data.school,
        onboardingStep: 3, // Move to part 3
      },
      create: {
        userId: session.user.id,
        currentEducationLevel: data.currentEducationLevel,
        school: data.school,
        onboardingStep: 3,
      },
    })

    revalidatePath("/student/onboarding")
    return { success: true, message: "Part 2 completed successfully" }

  } catch (error) {
    console.error("Error saving onboarding part 2:", error)
    return { error: "Failed to save academic background" }
  }
}

/**
 * Server Action: Save Part 3 of student onboarding (Subject & Skill Assessment)
 * 
 * @param data - Subject interests, skills, learning style, and accommodations
 * @returns Success response or error
 */
export async function saveOnboardingPart3(data: OnboardingPart3Data) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return { error: "Not authenticated" }
    }

    // Use transaction to ensure all data is saved consistently
    await prisma.$transaction(async (tx) => {
      // Update student profile with subject and skill information
      await tx.student.upsert({
        where: { userId: session.user.id },
        update: {
          subjectsOfInterest: data.subjectsOfInterest.join(", "),
          currentYear: data.currentYear,
          preferredLearningStyle: data.preferredLearningStyle,
          hasLearningDisabilities: data.hasLearningDisabilities,
          learningAccommodations: data.learningAccommodations || null,
          onboardingCompleted: true,
          onboardingStep: 3, // Completed
        },
        create: {
          userId: session.user.id,
          subjectsOfInterest: data.subjectsOfInterest.join(", "),
          currentYear: data.currentYear,
          preferredLearningStyle: data.preferredLearningStyle,
          hasLearningDisabilities: data.hasLearningDisabilities,
          learningAccommodations: data.learningAccommodations || null,
          onboardingCompleted: true,
          onboardingStep: 3,
        },
      })

      // Get the student record to access the ID
      const student = await tx.student.findUnique({
        where: { userId: session.user.id },
      })

      if (!student) {
        throw new Error("Student record not found")
      }

      // Delete existing subject skills to avoid duplicates
      await tx.subjectSkill.deleteMany({
        where: { studentId: student.id },
      })

      // Create new subject skill records
      if (data.subjectSkills.length > 0) {
        await tx.subjectSkill.createMany({
          data: data.subjectSkills.map(skill => ({
            studentId: student.id,
            subjectName: skill.subjectName,
            skillLevel: skill.skillLevel,
          })),
        })
      }
    })

    revalidatePath("/student/onboarding")
    revalidatePath("/student/dashboard")
    return { success: true, message: "Onboarding completed successfully!" }

  } catch (error) {
    console.error("Error saving onboarding part 3:", error)
    return { error: "Failed to save subject and skill assessment" }
  }
}

/**
 * Server Action: Save complete student onboarding (all parts at once)
 * 
 * @param data - Complete onboarding data
 * @returns Success response or error
 */
export async function saveCompleteOnboarding(data: CompleteOnboardingData) {
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

      // Create or update complete student profile
      await tx.student.upsert({
        where: { userId: session.user.id },
        update: {
          currentEducationLevel: data.currentEducationLevel,
          school: data.school,
          subjectsOfInterest: data.subjectsOfInterest.join(", "),
          currentYear: data.currentYear,
          preferredLearningStyle: data.preferredLearningStyle,
          hasLearningDisabilities: data.hasLearningDisabilities,
          learningAccommodations: data.learningAccommodations || null,
          onboardingCompleted: true,
          onboardingStep: 3,
        },
        create: {
          userId: session.user.id,
          currentEducationLevel: data.currentEducationLevel,
          school: data.school,
          subjectsOfInterest: data.subjectsOfInterest.join(", "),
          currentYear: data.currentYear,
          preferredLearningStyle: data.preferredLearningStyle,
          hasLearningDisabilities: data.hasLearningDisabilities,
          learningAccommodations: data.learningAccommodations || null,
          onboardingCompleted: true,
          onboardingStep: 3,
        },
      })

      // Get the student record to access the ID
      const student = await tx.student.findUnique({
        where: { userId: session.user.id },
      })

      if (!student) {
        throw new Error("Student record not found")
      }

      // Delete existing subject skills to avoid duplicates
      await tx.subjectSkill.deleteMany({
        where: { studentId: student.id },
      })

      // Create new subject skill records
      if (data.subjectSkills.length > 0) {
        await tx.subjectSkill.createMany({
          data: data.subjectSkills.map(skill => ({
            studentId: student.id,
            subjectName: skill.subjectName,
            skillLevel: skill.skillLevel,
          })),
        })
      }
    })

    revalidatePath("/student/onboarding")
    revalidatePath("/student/dashboard")
    return { success: true, message: "Complete onboarding saved successfully!" }

  } catch (error) {
    console.error("Error saving complete onboarding:", error)
    return { error: "Failed to save complete onboarding data" }
  }
}

/**
 * Server Action: Get current onboarding status and data
 * 
 * @returns Current onboarding data or error
 */
export async function getOnboardingStatus() {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return { error: "Not authenticated" }
    }

    // Get user and student data
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        student: {
          include: {
            subjectSkills: true,
          },
        },
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
        student: user.student ? {
          currentEducationLevel: user.student.currentEducationLevel,
          school: user.student.school,
          subjectsOfInterest: user.student.subjectsOfInterest?.split(", ") || [],
          currentYear: user.student.currentYear,
          preferredLearningStyle: user.student.preferredLearningStyle,
          hasLearningDisabilities: user.student.hasLearningDisabilities,
          learningAccommodations: user.student.learningAccommodations,
          onboardingCompleted: user.student.onboardingCompleted,
          onboardingStep: user.student.onboardingStep,
          subjectSkills: user.student.subjectSkills,
        } : null,
      },
    }

  } catch (error) {
    console.error("Error getting onboarding status:", error)
    return { error: "Failed to get onboarding status" }
  }
}

/**
 * Server Action: Reset onboarding (for testing or re-onboarding)
 * 
 * @returns Success response or error
 */
export async function resetOnboarding() {
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

    revalidatePath("/student/onboarding")
    return { success: true, message: "Onboarding reset successfully" }

  } catch (error) {
    console.error("Error resetting onboarding:", error)
    return { error: "Failed to reset onboarding" }
  }
}

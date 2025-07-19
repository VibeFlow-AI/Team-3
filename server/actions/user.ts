"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import type { UserRole } from "@/lib/generated/prisma"

/**
 * Updates a user's role and creates the corresponding profile
 * @param userId - The user's ID
 * @param role - The new role (STUDENT or MENTOR)
 * @param profileData - Additional profile data specific to the role
 */
export async function updateUserRole(
  userId: string, 
  role: UserRole, 
  profileData?: {
    // Student-specific fields
    currentEducationLevel?: string;
    school?: string;
    subjectsOfInterest?: string;
    // Mentor-specific fields
    professionalRole?: string;
    bio?: string;
    expertise?: string;
  }
) {
  try {
    // Start a transaction to ensure data consistency
    const result = await prisma.$transaction(async (tx) => {
      // Update user role
      const updatedUser = await tx.user.update({
        where: { id: userId },
        data: { role },
      });

      // Create role-specific profile
      if (role === "STUDENT") {
        await tx.student.create({
          data: {
            userId,
            currentEducationLevel: profileData?.currentEducationLevel,
            school: profileData?.school,
            subjectsOfInterest: profileData?.subjectsOfInterest,
          },
        });
      } else if (role === "MENTOR") {
        await tx.mentor.create({
          data: {
            userId,
            professionalRole: profileData?.professionalRole,
            bio: profileData?.bio,
            expertise: profileData?.expertise,
          },
        });
      }

      return updatedUser;
    });

    revalidatePath("/");
    return { success: true, user: result };
  } catch (error) {
    console.error("Error updating user role:", error);
    return { error: "Failed to update user role" };
  }
}

/**
 * Get a user with their profile data
 * @param userId - The user's ID
 */
export async function getUserWithProfile(userId: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        student: true,
        mentor: true,
      },
    });

    if (!user) {
      return { error: "User not found" };
    }

    return { success: true, user };
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return { error: "Failed to fetch user profile" };
  }
}

/**
 * Update student profile
 * @param userId - The user's ID
 * @param profileData - Student profile data
 */
export async function updateStudentProfile(
  userId: string,
  profileData: {
    currentEducationLevel?: string;
    school?: string;
    subjectsOfInterest?: string;
  }
) {
  try {
    const updatedStudent = await prisma.student.update({
      where: { userId },
      data: profileData,
    });

    revalidatePath("/");
    return { success: true, student: updatedStudent };
  } catch (error) {
    console.error("Error updating student profile:", error);
    return { error: "Failed to update student profile" };
  }
}

/**
 * Update mentor profile
 * @param userId - The user's ID
 * @param profileData - Mentor profile data
 */
export async function updateMentorProfile(
  userId: string,
  profileData: {
    professionalRole?: string;
    bio?: string;
    expertise?: string;
  }
) {
  try {
    const updatedMentor = await prisma.mentor.update({
      where: { userId },
      data: profileData,
    });

    revalidatePath("/");
    return { success: true, mentor: updatedMentor };
  } catch (error) {
    console.error("Error updating mentor profile:", error);
    return { error: "Failed to update mentor profile" };
  }
}

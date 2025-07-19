import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@/lib/generated/prisma";

const prisma = new PrismaClient();

/**
 * POST /api/mentor/match
 * Matches mentors for a student based on subjects, language, and grade.
 * Expects JSON body: { subjects: string[], language: string, grade: string|number }
 */
export async function POST(request: NextRequest) {
  try {
    const { subjects = [], language = "", grade = "" } = await request.json();

    // Fetch all mentors from the database
    const mentors = await prisma.mentor.findMany();

    // Score and sort mentors based on matching criteria
    const scoredMentors = mentors.map((mentor: any) => {
      let score = 0;

      // Subject match: +1 for each matching subject
      const mentorSubjects: string[] = Array.isArray(mentor.subjectsToTeach)
        ? mentor.subjectsToTeach
        : typeof mentor.subjectsToTeach === "string"
        ? mentor.subjectsToTeach.split(",").map((s: string) => s.trim())
        : [];
      if (Array.isArray(subjects)) {
        score += mentorSubjects.filter((sub: string) => subjects.includes(sub)).length;
      }

      // Language match: +1 if preferred language matches
      if (mentor.preferredLanguage === language) {
        score += 1;
      }

      // Grade match: +1 if mentor teaches the student's grade
      const mentorGrades: (string | number)[] = Array.isArray(mentor.gradesTaught)
        ? mentor.gradesTaught
        : typeof mentor.gradesTaught === "string"
        ? mentor.gradesTaught.split(",").map((g: string) => g.trim())
        : [];
      if (mentorGrades.includes(grade)) {
        score += 1;
      }

      return { mentor, score };
    });

    // Sort mentors by score, descending
    scoredMentors.sort((a, b) => b.score - a.score);

    // Return mentors only (or mentor + score if needed)
    return NextResponse.json(scoredMentors.map((item) => item.mentor), { status: 200 });
  } catch (error) {
    console.error("Error matching mentors:", error);
    return NextResponse.json({ error: "Failed to match mentors" }, { status: 500 });
  }
}
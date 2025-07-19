import { PrismaClient } from '../lib/generated/prisma';

const prisma = new PrismaClient();

/**
 * API handler to match mentors for a student based on subjects, language, and grade.
 * Expects req.body to contain: { subjects: string[], language: string, grade: string|number }
 */
export default async function handler(req, res) {
  try {
    // Extract student preferences from request body
    const { subjects = [], language = '', grade = '' } = req.body || {};

    // Fetch all mentors from the database
    const mentors = await prisma.mentor.findMany();

    // Score and sort mentors based on matching criteria
    const scoredMentors = mentors.map(mentor => {
      let score = 0;

      // Subject match: +1 for each matching subject
      if (Array.isArray(mentor.subjects) && Array.isArray(subjects)) {
        score += mentor.subjects.filter(sub => subjects.includes(sub)).length;
      }

      // Language match: +1 if preferred language is included
      if (Array.isArray(mentor.languages) && mentor.languages.includes(language)) {
        score += 1;
      }

      // Grade match: +1 if mentor teaches the student's grade
      if (Array.isArray(mentor.gradesTaught) && mentor.gradesTaught.includes(grade)) {
        score += 1;
      }

      return { mentor, score };
    });

    // Sort mentors by score, descending
    scoredMentors.sort((a, b) => b.score - a.score);

    // Return mentors only (or mentor + score if needed)
    res.status(200).json(scoredMentors.map(item => item.mentor));
  } catch (error) {
    console.error('Error matching mentors:', error);
    res.status(500).json({ error: 'Failed to match mentors' });
  }
}

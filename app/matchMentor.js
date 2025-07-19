import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { subjects, language, grade } = req.body;

  // Fetch all mentors from the database
  const mentors = await prisma.mentor.findMany();

  const scoredMentors = mentors.map(mentor => {
    let score = 0;

    // Subject match
    const subjectMatches = mentor.subjects.filter(sub => subjects.includes(sub)).length;
    score += subjectMatches;

    // Language match
    if (mentor.languages.includes(language)) score += 1;

    // Grade match
    if (mentor.gradesTaught.includes(grade)) score += 1;

    return { mentor, score };
  });

  // Sort mentors by score, descending
  scoredMentors.sort((a, b) => b.score - a.score);

  // Return mentor only (or mentor + score if desired)
  res.status(200).json(scoredMentors.map(item => item.mentor));
}

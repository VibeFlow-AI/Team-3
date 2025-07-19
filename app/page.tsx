import { prisma } from "@/lib/prisma";
import MentorPage from "./pages/mentor/page";

async function Home() {
  const samples = await prisma.sample.findMany();

  return <MentorPage />
}

export default Home;

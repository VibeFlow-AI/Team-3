import { prisma } from "@/lib/prisma";
import SignUpPage from "./signup/page";

async function Home() {
  const samples = await prisma.sample.findMany();

  return (
    // <MentorPage />
    // <LoginPage />
    <SignUpPage />
  );
}

export default Home;

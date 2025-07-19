import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { PrismaClient } from "./lib/generated/prisma"
import { UserRole } from "./lib/generated/prisma"
import GitHub from "next-auth/providers/github"
import Google from "next-auth/providers/google"
import Facebook from "next-auth/providers/facebook"

// Initialize Prisma Client
const prisma = new PrismaClient()

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  providers: [
    GitHub({
      clientId: process.env.AUTH_GITHUB_ID,
      clientSecret: process.env.AUTH_GITHUB_SECRET,
    }),
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
    Facebook({
      clientId: process.env.AUTH_FACEBOOK_ID,
      clientSecret: process.env.AUTH_FACEBOOK_SECRET,
    }),
  ],
  callbacks: {
    // The `jwt` callback is called when a JWT is created.
    // We augment the token with the user's ID and role from the database.
    async jwt({ token }) {
      if (!token.sub) return token; // If there is no user ID, do nothing.

      const dbUser = await prisma.user.findUnique({
        where: { id: token.sub },
      });

      if (!dbUser) return token; // If user is not found, do nothing.

      // Add role and id to the token
      token.role = dbUser.role;
      token.id = dbUser.id;
      
      return token;
    },

    // The `session` callback is called when a session is accessed.
    // We add the custom properties from the JWT to the session object.
    async session({ session, token }) {
      if (token && session.user) {
        (session.user as any).role = token.role as UserRole;
        (session.user as any).id = token.id as string;
      }
      return session;
    },
  },
  // If you have custom pages for login, error, etc., specify them here.
  // pages: {
  //   signIn: '/login',
  // },
})


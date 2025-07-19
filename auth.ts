import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { PrismaClient } from "./lib/generated/prisma"
import { UserRole } from "./lib/generated/prisma"
import bcrypt from "bcryptjs"
import GitHub from "next-auth/providers/github"
import Google from "next-auth/providers/google"
import Facebook from "next-auth/providers/facebook"
import Email from "next-auth/providers/email"
import Credentials from "next-auth/providers/credentials"

// Initialize Prisma Client
const prisma = new PrismaClient()

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  
  // --- SESSION CONFIGURATION UPDATE ---
  // Strategy is now "database". The session cookie will only contain a sessionToken,
  // which is used to look up the session in the database.
  session: {
    strategy: "database",
    // Set the session max age to 2 hours (in seconds).
    // After this period, the session will be invalid and the user must log in again.
    maxAge: 2 * 60 * 60, // 7200 seconds = 2 hours
  },
  providers: [
    // --- OAUTH PROVIDERS (EXISTING) ---
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

    // --- EMAIL (PASSWORDLESS) PROVIDER ---
    Email({
      server: {
        host: process.env.EMAIL_SERVER_HOST,
        port: process.env.EMAIL_SERVER_PORT,
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASSWORD,
        },
      },
      from: process.env.EMAIL_FROM,
    }),

    // --- CREDENTIALS (EMAIL/PASSWORD) PROVIDER ---
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) {
          return null;
        }

        // 1. Find user by email in the database
        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
        });

        if (!user || !user.password) {
          // No user found, or user signed up with OAuth (no password)
          return null;
        }

        // 2. Compare the provided password with the stored hashed password
        const isPasswordValid = await bcrypt.compare(
          credentials.password as string,
          user.password
        );

        if (!isPasswordValid) {
          return null; // Password incorrect
        }

        // 3. Return the user object if authentication is successful
        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        };
      },
    }),
  ],
  
  // --- CALLBACKS UPDATE ---
  // With a database strategy, the callbacks are simplified. We ensure the session object
  // returned to the client contains our custom `id` and `role` fields.
  callbacks: {
    async session({ session, user }) {
      // The `user` object here is the user from the database.
      // We add the user's ID and role to the session object.
      if (session.user) {
        (session.user as any).id = user.id;
        // The type for role needs to be asserted here
        (session.user as any).role = (user as any).role as UserRole;
      }
      return session;
    },
    // Note: JWT callback is no longer needed for session management with database strategy
    // as session data is stored in the database, not in the JWT token
  },
  // If you have custom pages for login, error, etc., specify them here.
  // pages: {
  //   signIn: '/login',
  // },
})


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
  session: { strategy: "jwt" },
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


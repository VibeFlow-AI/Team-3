import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "./lib/prisma"
import { UserRole } from "./lib/generated/prisma"
import bcrypt from "bcryptjs"
import GitHub from "next-auth/providers/github"
import Google from "next-auth/providers/google"
import Facebook from "next-auth/providers/facebook"
import Email from "next-auth/providers/email"
import Credentials from "next-auth/providers/credentials"

/**
 * NextAuth.js configuration for EduVibe authentication system
 * 
 * Features:
 * - Database-backed sessions with 24-hour expiry
 * - Multiple OAuth providers (GitHub, Google, Facebook)
 * - Email/passwordless authentication
 * - Credentials-based authentication with bcrypt password hashing
 * - Custom user roles (STUDENT, MENTOR, ADMIN)
 * - Prisma adapter for database persistence
 */

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  
  /**
   * Session Configuration
   * 
   * Strategy: "database" - Sessions are stored in the database rather than JWT tokens
   * MaxAge: 24 hours (86400 seconds) - After this period, users must re-authenticate
   * 
   * Database sessions provide better security and allow for session management features
   * like viewing active sessions and remote logout capabilities.
   */
  session: {
    strategy: "database",
<<<<<<< Updated upstream
    // Set the session max age to 2 hours (in seconds).
    // After this period, the session will be invalid and the user must log in again.
    maxAge: 2 * 60 * 60, // 7200 seconds = 2 hours
=======
    maxAge: 24 * 60 * 60, // 86400 seconds = 24 hours
>>>>>>> Stashed changes
  },
  providers: [
    /**
     * OAuth Providers
     * 
     * Configure OAuth providers for social authentication.
     * Requires environment variables for client IDs and secrets.
     */
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

    /**
     * Email Provider (Passwordless Authentication)
     * 
     * Sends magic links to users' email addresses for authentication.
     * Requires SMTP server configuration in environment variables.
     */
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

    /**
     * Credentials Provider (Email/Password Authentication)
     * 
     * Handles traditional email and password authentication.
     * Passwords are hashed using bcrypt for security.
     * 
     * @param credentials - Object containing email and password
     * @returns User object if authentication successful, null otherwise
     */
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

        // Find user by email in the database
        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
        });

        if (!user || !user.password) {
          // No user found, or user signed up with OAuth (no password)
          return null;
        }

        // Compare the provided password with the stored hashed password
        const isPasswordValid = await bcrypt.compare(
          credentials.password as string,
          user.password
        );

        if (!isPasswordValid) {
          return null; // Password incorrect
        }

        // Return the user object if authentication is successful
        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        };
      },
    }),
  ],
  
  /**
   * Callbacks Configuration
   * 
   * With database strategy, callbacks are simplified. The session callback
   * ensures that custom user fields (id and role) are included in the session
   * object returned to the client.
   */
  callbacks: {
    /**
     * Session Callback
     * 
     * Augments the session object with custom user data from the database.
     * The user object here comes directly from the database via the adapter.
     * 
     * @param session - The session object
     * @param user - The user object from the database
     * @returns Modified session object with custom fields
     */
    async session({ session, user }) {
      // Add the user's ID and role to the session object
      if (session.user) {
        (session.user as any).id = user.id;
        (session.user as any).role = (user as any).role as UserRole;
      }
      return session;
    },
    // Note: JWT callback is not needed with database strategy
    // as session data is stored in the database, not in JWT tokens
  },
  
  // Custom pages configuration (if needed)
  // pages: {
  //   signIn: '/login',
  //   error: '/auth/error',
  // },
})


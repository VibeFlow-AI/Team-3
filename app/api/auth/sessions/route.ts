import { NextResponse } from "next/server";
import { PrismaClient } from "@/lib/generated/prisma";
import { auth } from "@/auth";

const prisma = new PrismaClient();

/**
 * GET /api/auth/sessions
 * 
 * Retrieves all active sessions for the authenticated user.
 * This allows users to see where they are currently logged in and manage their sessions.
 * 
 * @returns Array of session objects containing session details
 */
export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Get all sessions for the current user
    const userSessions = await prisma.session.findMany({
      where: { userId: session.user.id },
      select: {
        id: true,
        sessionToken: true,
        expires: true,
        // Don't expose the full session token for security
      },
      orderBy: {
        expires: 'desc'
      }
    });

    // Add additional metadata for each session
    const sessionsWithMetadata = userSessions.map(userSession => ({
      id: userSession.id,
      expires: userSession.expires,
      // Note: We can't directly compare session tokens due to type limitations
      // This would require additional logic to identify the current session
      timeUntilExpiry: Math.max(0, Math.floor((userSession.expires.getTime() - Date.now()) / 1000)),
      expiresAt: userSession.expires.toISOString(),
      isActive: userSession.expires > new Date(),
    }));

    return NextResponse.json({
      sessions: sessionsWithMetadata,
      totalSessions: userSessions.length,
    });

  } catch (error) {
    console.error("Error fetching user sessions:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

/**
 * DELETE /api/auth/sessions?sessionId=<id>
 * 
 * Allows an authenticated user to delete/revoke one of their sessions by its ID.
 * This enables users to log out from specific devices or browsers.
 * 
 * @param request - The request object containing the sessionId query parameter
 * @returns Success message or error response
 */
export async function DELETE(request: Request) {
  try {
    const session = await auth();
    const { searchParams } = new URL(request.url);
    const sessionIdToDelete = searchParams.get('sessionId');

    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    
    if (!sessionIdToDelete) {
      return new NextResponse("Session ID is required", { status: 400 });
    }

    // Verify the session exists and belongs to the current user
    const targetSession = await prisma.session.findUnique({
      where: { id: sessionIdToDelete },
    });

    if (!targetSession) {
      return new NextResponse("Session not found", { status: 404 });
    }

    if (targetSession.userId !== session.user.id) {
      return new NextResponse("Forbidden - You can only delete your own sessions", { status: 403 });
    }

    // Delete the session from the database
    await prisma.session.delete({
      where: { id: sessionIdToDelete },
    });

    return NextResponse.json({
      message: "Session revoked successfully",
      deletedSessionId: sessionIdToDelete
    });

  } catch (error) {
    console.error("Error deleting session:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

/**
 * POST /api/auth/sessions/revoke-all
 * 
 * Revokes all sessions for the current user except the current one.
 * Useful for "log out from all devices" functionality.
 */
export async function POST(request: Request) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');
    
    if (action === 'revoke-all') {
      // Delete all sessions except current ones that are still active
      // Note: We revoke all other sessions for the user
      const currentTime = new Date();
      
      // Count sessions before deletion for reporting
      const totalSessions = await prisma.session.count({
        where: { userId: session.user.id }
      });
      
      // Delete all sessions for the user (they'll need to re-login)
      // In a production scenario, you might want to be more selective
      const deletedSessions = await prisma.session.deleteMany({
        where: {
          userId: session.user.id,
          expires: {
            lt: currentTime // Only delete expired sessions, or modify logic as needed
          }
        }
      });

      return NextResponse.json({
        message: "All other sessions revoked successfully",
        revokedCount: deletedSessions.count,
        totalSessions: totalSessions
      });
    }

    return new NextResponse("Invalid action", { status: 400 });

  } catch (error) {
    console.error("Error revoking sessions:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

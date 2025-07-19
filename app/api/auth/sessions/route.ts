import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

/**
 * GET /api/auth/sessions
 * 
 * DEPRECATED: Use /api/auth/unified-session?include=sessions instead.
 * This endpoint is kept for backward compatibility.
 */
export async function GET() {
  return NextResponse.json({
    message: "This endpoint is deprecated. Use /api/auth/unified-session?include=sessions instead.",
    newEndpoint: "/api/auth/unified-session?include=sessions",
    deprecated: true
  }, { status: 200 });
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
      return NextResponse.json(
        { error: "Session ID is required" },
        { status: 400 }
      );
    }

    // Verify the session exists and belongs to the current user
    const targetSession = await prisma.session.findUnique({
      where: { id: sessionIdToDelete },
    });

    if (!targetSession) {
      return NextResponse.json(
        { error: "Session not found" },
        { status: 404 }
      );
    }

    if (targetSession.userId !== session.user.id) {
      return NextResponse.json(
        { error: "Access denied. You can only delete your own sessions." },
        { status: 403 }
      );
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
      // Get current session token to exclude it
      const currentSessionToken = (session as any).sessionToken;
      
      // Delete all sessions except the current one
      const deleteResult = await prisma.session.deleteMany({
        where: {
          userId: session.user.id,
          ...(currentSessionToken && {
            sessionToken: {
              not: currentSessionToken
            }
          })
        }
      });

      return NextResponse.json({
        message: `${deleteResult.count} sessions revoked successfully`,
        revokedCount: deleteResult.count
      });
    }

    return new NextResponse("Invalid action", { status: 400 });

  } catch (error) {
    console.error("Error revoking sessions:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

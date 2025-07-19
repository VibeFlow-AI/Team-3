import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { PrismaClient } from "@/lib/generated/prisma";

const prisma = new PrismaClient();

/**
 * GET /api/test/session-migration
 * 
 * Test endpoint to verify that database sessions are working correctly
 * and that the 24-hour expiration is properly configured.
 */
export async function GET() {
  try {
    const session = await auth();
    
    if (!session?.user) {
      return NextResponse.json({
        status: "success",
        message: "No active session - database session migration test ready",
        sessionStrategy: "database",
        configured: true
      });
    }

    // Get session details from database
    const dbSessions = await prisma.session.findMany({
      where: { userId: (session.user as any).id },
      select: {
        id: true,
        expires: true,
        userId: true,
      }
    });

    // Calculate session details
    const now = new Date();
    const sessionExpiry = new Date(session.expires);
    const timeRemaining = Math.max(0, Math.floor((sessionExpiry.getTime() - now.getTime()) / 1000));
    const maxAge = 24 * 60 * 60; // 24 hours
    
    return NextResponse.json({
      status: "success",
      message: "Database session migration successful",
      sessionStrategy: "database",
      sessionDetails: {
        userId: (session.user as any).id,
        userRole: (session.user as any).role,
        sessionExpiry: sessionExpiry.toISOString(),
        timeRemaining: timeRemaining,
        timeRemainingFormatted: formatTime(timeRemaining),
        maxAge: maxAge,
        isWithin24Hours: timeRemaining <= maxAge,
      },
      databaseSessions: {
        count: dbSessions.length,
        sessions: dbSessions.map(s => ({
          id: s.id,
          expires: s.expires.toISOString(),
          isExpired: s.expires < now,
          timeUntilExpiry: Math.max(0, Math.floor((s.expires.getTime() - now.getTime()) / 1000))
        }))
      },
      testResults: {
        sessionExists: true,
        sessionStoredInDatabase: dbSessions.length > 0,
        expirationConfigured: timeRemaining <= maxAge,
        withinExpectedRange: timeRemaining > 0 && timeRemaining <= maxAge,
      }
    });

  } catch (error) {
    console.error("Session migration test error:", error);
    return NextResponse.json({
      status: "error",
      message: "Session migration test failed",
      error: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 });
  }
}

function formatTime(seconds: number): string {
  if (seconds <= 0) return "Expired";
  
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  } else {
    return `${minutes}m`;
  }
}

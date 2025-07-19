import { auth } from "@/auth";
import { NextResponse } from "next/server";

/**
 * GET /api/auth/session-status
 * 
 * Returns detailed session status including expiration information.
 * This endpoint is used by frontend components to monitor session expiry
 * and provide warnings to users before their 24-hour session expires.
 * 
 * @returns Session status object with authentication state and timing information
 */
export async function GET() {
  try {
    const session = await auth();
    
    if (!session?.user) {
      return NextResponse.json({
        authenticated: false,
        expired: true,
        timeRemaining: 0,
        message: "No active session found"
      }, { status: 200 });
    }

    // Calculate session expiry based on the session.expires field
    const now = Date.now();
    const expiresAt = new Date(session.expires).getTime();
    const timeRemaining = Math.max(0, Math.floor((expiresAt - now) / 1000));
    const expired = timeRemaining === 0;

    // Calculate session age for additional context
    const maxAge = 2 * 60 * 60; // 24 hours in seconds
    const sessionAge = maxAge - timeRemaining;
    const sessionAgeHours = Math.floor(sessionAge / 3600);
    const sessionAgeMinutes = Math.floor((sessionAge % 3600) / 60);

    return NextResponse.json({
      authenticated: !expired,
      expired,
      timeRemaining,
      timeRemainingFormatted: formatTimeRemaining(timeRemaining),
      expiresAt: new Date(expiresAt).toISOString(),
      sessionAge: {
        total: sessionAge,
        hours: sessionAgeHours,
        minutes: sessionAgeMinutes,
        formatted: `${sessionAgeHours}h ${sessionAgeMinutes}m`
      },
      user: expired ? null : {
        id: (session.user as any).id,
        role: (session.user as any).role,
        name: session.user.name,
        email: session.user.email
      },
      warnings: {
        showWarning: !expired && timeRemaining <= 300, // Show warning when 5 minutes left
        showUrgentWarning: !expired && timeRemaining <= 60, // Show urgent warning when 1 minute left
      }
    }, { status: 200 });
    
  } catch (error) {
    console.error("Error checking session status:", error);
    return NextResponse.json({
      authenticated: false,
      expired: true,
      timeRemaining: 0,
      error: "Failed to check session status"
    }, { status: 500 });
  }
}

/**
 * Helper function to format time remaining in a human-readable format
 * @param seconds - Time remaining in seconds
 * @returns Formatted string like "2h 30m" or "45m" or "30s"
 */
function formatTimeRemaining(seconds: number): string {
  if (seconds <= 0) return "Expired";
  
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;
  
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  } else if (minutes > 0) {
    return `${minutes}m`;
  } else {
    return `${remainingSeconds}s`;
  }
}

import { NextResponse } from 'next/server'
import { auth } from "./auth"

export default auth((req) => {
  const { nextUrl } = req;
  const session = req.auth;
  const userRole = (session?.user as any)?.role;
  const isLoggedIn = !!session;

  const isStudentDashboard = nextUrl.pathname.startsWith('/student/dashboard');
  const isMentorDashboard = nextUrl.pathname.startsWith('/mentor/dashboard');
  const isLoginPage = nextUrl.pathname.startsWith('/login');

  // Rule 1: Redirect authenticated users away from the login page to their respective dashboards.
  if (isLoggedIn && isLoginPage) {
    if (userRole === 'MENTOR') {
      return NextResponse.redirect(new URL('/mentor/dashboard', nextUrl));
    }
    return NextResponse.redirect(new URL('/student/dashboard', nextUrl));
  }
  
  // Rule 2: Protect dashboards from unauthenticated users.
  if (!isLoggedIn && (isStudentDashboard || isMentorDashboard)) {
    return NextResponse.redirect(new URL('/login', nextUrl));
  }

  // Rule 3: Enforce role-based access to dashboards.
  if (isLoggedIn) {
    if (userRole === 'STUDENT' && isMentorDashboard) {
      return NextResponse.redirect(new URL('/student/dashboard', nextUrl));
    }
    if (userRole === 'MENTOR' && isStudentDashboard) {
      return NextResponse.redirect(new URL('/mentor/dashboard', nextUrl));
    }
  }

  // If no rules match, allow the request to proceed.
  return NextResponse.next();
})

// Use the matcher to specify which routes the middleware should run on.
export const config = {
  matcher: [
    '/student/dashboard/:path*',
    '/mentor/dashboard/:path*',
    '/login',
  ],
}

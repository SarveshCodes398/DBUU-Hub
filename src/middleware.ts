import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Public routes - allow without auth
  const publicPaths = [
    "/",
    "/auth/login",
    "/auth/register",
    "/api/auth/login",
    "/api/auth/register",
    "/api/auth/logout",
  ];

  // Allow public paths
  if (publicPaths.includes(pathname)) {
    return NextResponse.next();
  }

  // Allow Next.js internals and static assets
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/assets") ||
    pathname.startsWith("/favicon")
  ) {
    return NextResponse.next();
  }

  // Check for auth cookie
  const authToken = request.cookies.get("auth_token");

  if (!authToken || !authToken.value) {
    // Not logged in - redirect to login
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/auth/login";
    return NextResponse.redirect(loginUrl);
  }

  // Logged in - allow access
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};

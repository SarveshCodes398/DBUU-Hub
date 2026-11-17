import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Next.js internals, static assets, and images
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/assets") ||
    pathname.startsWith("/favicon") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // Public Campus Routes & Open APIs
  const isPublicRoute =
    pathname === "/" ||
    pathname.startsWith("/auth/") ||
    pathname.startsWith("/games") ||
    pathname.startsWith("/confessions") ||
    pathname.startsWith("/events") ||
    pathname.startsWith("/vault") ||
    pathname.startsWith("/recruitment") ||
    pathname.startsWith("/api/confessions") ||
    pathname.startsWith("/api/multiplayer") ||
    pathname.startsWith("/api/events") ||
    pathname.startsWith("/api/vault") ||
    pathname.startsWith("/api/recruitment") ||
    pathname.startsWith("/api/auth/");

  if (isPublicRoute) {
    return NextResponse.next();
  }

  // Check for auth cookie for protected routes (e.g. /profile)
  const authToken = request.cookies.get("auth_token");

  if (!authToken || !authToken.value) {
    // If it's an API route, return JSON 401 unauthorized
    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ success: false, error: "Authentication required" }, { status: 401 });
    }
    // For protected pages (e.g. /profile), redirect to login
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/auth/login";
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};

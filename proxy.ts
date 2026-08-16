import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/session";

export async function proxy(request: NextRequest) {
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  const isLoginPage = request.nextUrl.pathname === "/login";
  const isAdminRoute = request.nextUrl.pathname.startsWith("/admin");

  const validSession = token ? await verifySessionToken(token) : false;

  // Redirect to the login page when accessing admin routes without a valid session
  if (isAdminRoute && !validSession) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Redirect signed-in users away from the login page to the dashboard
  if (isLoginPage && validSession) {
    return NextResponse.redirect(new URL("/admin/dashboard", request.url));
  }

  return NextResponse.next();
}

// Configure which routes the proxy should watch
export const config = {
  matcher: ["/admin/:path*", "/login"],
};

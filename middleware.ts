import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

// Define protected routes and required roles
const protectedRoutes = [
  "/dashboard", // Protect root path
];


// Define routes that should be excluded from middleware (public routes)
const excludedRoutes = [
  "/login",
  "/register",
  "/api",
  "/_next",
  "/favicon.ico",
  "/rejected",
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // console.log("Middleware running for path:", pathname);

  // Skip middleware for excluded routes
  if (excludedRoutes.some((route) => pathname.startsWith(route))) {
    // console.log("Skipping middleware for excluded route:", pathname);
    return NextResponse.next();
  }

  // Only check protected routes
  if (protectedRoutes.some((route) => pathname.startsWith(route))) {
    try {
      const cookieName =
        process.env.NODE_ENV === "production"
          ? "__Secure-authjs.session-token" // <-- double underscore!
          : "authjs.session-token";

      const token = await getToken({
        req: request,
        secret: process.env.NEXTAUTH_SECRET!,
        cookieName,
      });
      // console.log("Token found:", token ? "Yes" : "No");

      // If no token, redirect to login
      if (!token) {
        const url = request.nextUrl.clone();
        url.pathname = "/login";
        return NextResponse.redirect(url);
      }

      // If token exists but no role, redirect to onboarding
      if (!token.role || token.role === "") {
        // console.log("Token found but no role, redirecting to onboarding");
        const url = request.nextUrl.clone();
        url.pathname = "/onboarding";
        return NextResponse.redirect(url);
      }

      // console.log("User authorized, allowing access to:", pathname);
    } catch (error) {
      console.error("Middleware error:", error);
      // On error, redirect to login for safety
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      return NextResponse.redirect(url);
    }
  }

  // Allow request to proceed
  return NextResponse.next();
}

// Configure which routes to run middleware on
export const config = {
  matcher: [
    // Only run middleware on these specific routes
    "/",
    "/:path*",
  ],
  runtime: "experimental-edge",
};

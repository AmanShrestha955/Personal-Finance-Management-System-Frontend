import { NextRequest, NextResponse } from "next/server";

const PUBLIC_ROUTES = [
  "/",
  "/sign-in",
  "/sign-up",
  "/forgot-password",
  "/admin-sign-in",
];

const PUBLIC_PREFIXES = ["/verify-email", "/reset-password"];

const ADMIN_ROUTES = ["/admin"];

const isTokenExpired = (token: string): boolean => {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.exp * 1000 < Date.now();
  } catch {
    return true;
  }
};

export const middleware = (req: NextRequest) => {
  const { pathname, searchParams } = req.nextUrl;

  const isPublic =
    PUBLIC_ROUTES.includes(pathname) ||
    PUBLIC_PREFIXES.some((prefix) => pathname.startsWith(prefix));

  if (isPublic) {
    return NextResponse.next();
  }

  // Check if this is an admin route
  const isAdminRoute = ADMIN_ROUTES.some((prefix) =>
    pathname.startsWith(prefix),
  );

  if (isAdminRoute) {
    // Allow preview mode without authentication
    const previewMode = searchParams.get("preview") === "true";
    if (previewMode) {
      return NextResponse.next();
    }

    const adminToken = req.cookies.get("adminToken")?.value;
    const userRole = req.cookies.get("userRole")?.value;

    if (!adminToken || userRole !== "admin" || isTokenExpired(adminToken)) {
      const adminSignInUrl = new URL("/admin-sign-in", req.url);
      adminSignInUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(adminSignInUrl);
    }

    return NextResponse.next();
  }

  // Regular user routes
  const token = req.cookies.get("token")?.value;

  if (!token || isTokenExpired(token)) {
    const signInUrl = new URL("/sign-in", req.url);
    signInUrl.searchParams.set("redirect", pathname); // optional: redirect back after login
    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.next();
};

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.png$).*)"],
};

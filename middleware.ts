import { NextRequest, NextResponse } from "next/server";

const PUBLIC_ROUTES = ["/", "/sign-in", "/sign-up"];

const isTokenExpired = (token: string): boolean => {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.exp * 1000 < Date.now();
  } catch {
    return true;
  }
};

export const middleware = (req: NextRequest) => {
  const { pathname } = req.nextUrl;

  if (PUBLIC_ROUTES.includes(pathname)) {
    return NextResponse.next();
  }

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

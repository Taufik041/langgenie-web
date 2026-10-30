import { NextResponse, type NextRequest } from "next/server";

// Lightweight gate: real signature verification happens server-side in getCurrentUser().
export function middleware(req: NextRequest) {
  const hasSession = req.cookies.has("lg_session");
  const { pathname } = req.nextUrl;
  if (pathname.startsWith("/dashboard") && !hasSession) {
    const url = new URL("/login", req.url);
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = { matcher: ["/dashboard/:path*"] };

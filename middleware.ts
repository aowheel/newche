import { NextRequest, NextResponse } from "next/server";
import authConfig from "./auth.config";
import NextAuth from "next-auth";

export default NextAuth(authConfig).auth;

export function middleware(request: NextRequest) {
  const isOnInternal = request.nextUrl.pathname.startsWith("/internal");
  if (isOnInternal) {
    const tutorial = request.cookies.get("tutorial")?.value;
    if (tutorial === "20240823") return NextResponse.next();
    return NextResponse.redirect(new URL("/", request.url));
  }
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
};

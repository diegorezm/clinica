import { NextRequest, NextResponse } from "next/server";

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|login$).*)",
  ],
};

export function middleware(req: NextRequest) {
  // const { pathname } = new URL(req.url);
  return NextResponse.next();
}

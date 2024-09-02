import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  // const { pathname } = new URL(req.url);
  return NextResponse.next();
}

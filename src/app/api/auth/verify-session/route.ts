import { lucia } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

const handler = async (req: NextRequest) => {
  const sessionId = req.cookies.get(lucia.sessionCookieName)?.value ?? null;

  if (!sessionId) {
    return NextResponse.json({ valid: false });
  }

  const { session } = await lucia.validateSession(sessionId);

  if (!session) {
    return NextResponse.json({ valid: false });
  }

  return NextResponse.json({ valid: true });
};

export { handler as GET };

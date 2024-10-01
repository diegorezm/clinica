"use server"

import {lucia} from "@/lib/auth"
import {cookies} from "next/headers"

export async function verifySession() {
  const cookieStore = cookies()
  const sessionId = cookieStore.get(lucia.sessionCookieName)?.value ?? null
  if (!sessionId) {
    return null
  }
  const {session} = await lucia.validateSession(sessionId)
  if (!session) {
    return null
  }
  return session
}

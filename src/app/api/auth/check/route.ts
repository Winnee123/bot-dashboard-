import { getSession } from "@/lib/session"
import { NextRequest } from "next/server"

export async function GET(req: NextRequest) {
  const session = await getSession(req)
  return Response.json({ valid: !!session.userId, userId: session.userId || null })
}

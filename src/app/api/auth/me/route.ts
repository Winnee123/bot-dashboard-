import { getSession } from "@/lib/session"
import { getUser } from "@/lib/discord"
import { NextRequest } from "next/server"

export async function GET(req: NextRequest) {
  const session = await getSession(req)
  if (!session.userId || !session.accessToken) {
    return Response.json({ user: null }, { status: 401 })
  }
  try {
    const user = await getUser(session.accessToken)
    return Response.json({ user })
  } catch {
    return Response.json({ user: null }, { status: 401 })
  }
}

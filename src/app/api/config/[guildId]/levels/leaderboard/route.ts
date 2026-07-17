import { getSession } from "@/lib/session"
import { getLeaderboard } from "@/lib/db"
import { NextRequest } from "next/server"

export async function GET(req: NextRequest, { params }: { params: Promise<{ guildId: string }> }) {
  const session = await getSession(req)
  if (!session.userId) return Response.json({ error: "Unauthorized" }, { status: 401 })
  const { guildId } = await params
  const board = await getLeaderboard(guildId)
  return Response.json({ leaderboard: board })
}

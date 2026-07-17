import { getSession } from "@/lib/session"
import { getAutoModConfig, upsertAutoModConfig } from "@/lib/db"
import { NextRequest } from "next/server"

export async function GET(req: NextRequest, { params }: { params: Promise<{ guildId: string }> }) {
  const session = await getSession(req)
  if (!session.userId) return Response.json({ error: "Unauthorized" }, { status: 401 })
  const { guildId } = await params
  const config = await getAutoModConfig(guildId)
  return Response.json({ config })
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ guildId: string }> }) {
  const session = await getSession(req)
  if (!session.userId) return Response.json({ error: "Unauthorized" }, { status: 401 })
  const { guildId } = await params
  const body = await req.json()
  await upsertAutoModConfig(guildId, { guild_id: guildId, ...body })
  return Response.json({ success: true })
}

import { getSession } from "@/lib/session"
import { getGuildConfig, upsertGuild } from "@/lib/db"
import { checkBotInGuild } from "@/lib/discord"
import { NextRequest } from "next/server"

export async function GET(req: NextRequest, { params }: { params: Promise<{ guildId: string }> }) {
  const session = await getSession(req)
  if (!session.userId) return Response.json({ error: "Unauthorized" }, { status: 401 })

  const { guildId } = await params
  const [guild, hasBot] = await Promise.all([getGuildConfig(guildId), checkBotInGuild(guildId)])

  if (!guild) {
    const defaults = { id: guildId, name: "Unknown", owner_id: session.userId, prefix: "!", language: "es" }
    await upsertGuild(guildId, defaults)
    return Response.json({ guild: { ...defaults, logsConfig: null, ttsConfig: null, moderationConfig: null, musicConfig: null, customEmbeds: [] }, hasBot })
  }
  return Response.json({ guild, hasBot })
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ guildId: string }> }) {
  const session = await getSession(req)
  if (!session.userId) return Response.json({ error: "Unauthorized" }, { status: 401 })
  const { guildId } = await params
  const body = await req.json()
  await upsertGuild(guildId, { ...body, owner_id: body.owner_id || session.userId })
  return Response.json({ success: true })
}

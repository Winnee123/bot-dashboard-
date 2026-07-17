import { getSession } from "@/lib/session"
import { getGuildChannels } from "@/lib/discord"
import { NextRequest } from "next/server"

export async function GET(req: NextRequest, { params }: { params: Promise<{ guildId: string }> }) {
  const session = await getSession(req)
  if (!session.userId) {
    return Response.json(
      {
        error: "Unauthorized",
        debug: {
          hasUserId: !!session.userId,
        },
      },
      { status: 401 },
    )
  }

  const { guildId } = await params
  try {
    const channels = await getGuildChannels(guildId)
    console.log(`[channels] guild=${guildId} total=${channels.length}`)
    const textChannels = channels.filter((c) => c.type === 0).map((c) => ({ id: c.id, name: c.name }))
    return Response.json({ channels: textChannels })
  } catch (e: any) {
    console.error(`[channels] Error guild=${guildId}:`, e.message)
    return Response.json({ channels: [], error: e?.message || "Error" })
  }
}


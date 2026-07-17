import { getSession } from "@/lib/session"
import { filterAdminGuilds, getBotGuilds, getUserGuilds } from "@/lib/discord"
import { NextRequest } from "next/server"

export async function GET(req: NextRequest) {
  const session = await getSession(req)
  if (!session.userId || !session.accessToken) {
    return Response.json({ error: "Unauthorized" }, { status: 401 })
  }

  const [userGuildsResult, botGuildIds] = await Promise.allSettled([
    getUserGuilds(session.accessToken),
    getBotGuilds(),
  ])

  const userGuilds = userGuildsResult.status === "fulfilled" ? userGuildsResult.value : []
  const botIds = new Set(botGuildIds.status === "fulfilled" ? botGuildIds.value : [])

  const guilds = filterAdminGuilds(userGuilds).map((g) => ({
    id: g.id, name: g.name, icon: g.icon, hasBot: botIds.has(g.id),
  }))

  return Response.json({ guilds })
}

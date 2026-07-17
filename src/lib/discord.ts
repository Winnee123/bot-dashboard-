const DISCORD_API = "https://discord.com/api/v10"
const CLIENT_ID = process.env.DISCORD_CLIENT_ID!
const CLIENT_SECRET = process.env.DISCORD_CLIENT_SECRET!
const REDIRECT_URI = process.env.DISCORD_REDIRECT_URI!

export function getOAuthUrl() {
  const url = new URL(`${DISCORD_API}/oauth2/authorize`)
  url.searchParams.set("client_id", CLIENT_ID)
  url.searchParams.set("redirect_uri", REDIRECT_URI)
  url.searchParams.set("response_type", "code")
  url.searchParams.set("scope", "identify guilds")
  return url.toString()
}

export async function exchangeCode(code: string) {
  const body = new URLSearchParams({
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
    grant_type: "authorization_code",
    code,
    redirect_uri: REDIRECT_URI,
  })
  const res = await fetch(`${DISCORD_API}/oauth2/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Discord token exchange failed (${res.status}): ${text}`)
  }
  return res.json() as Promise<{ access_token: string; refresh_token: string; expires_in: number }>
}

export async function getUser(token: string) {
  const res = await fetch(`${DISCORD_API}/users/@me`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!res.ok) throw new Error("Failed to fetch user")
  return res.json() as Promise<{ id: string; username: string; discriminator: string; avatar: string | null; global_name: string | null }>
}

export async function getUserGuilds(token: string) {
  const res = await fetch(`${DISCORD_API}/users/@me/guilds`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!res.ok) throw new Error("Failed to fetch guilds")
  return res.json() as Promise<Array<{ id: string; name: string; icon: string | null; owner: boolean; permissions: string }>>
}

export function filterAdminGuilds(guilds: Awaited<ReturnType<typeof getUserGuilds>>) {
  return guilds.filter((g) => g.owner || (BigInt(g.permissions) & BigInt("0x8")) === BigInt("0x8"))
}

export async function getBotGuilds() {
  if (!process.env.DISCORD_TOKEN) return []
  const res = await fetch(`${DISCORD_API}/users/@me/guilds`, {
    headers: { Authorization: `Bot ${process.env.DISCORD_TOKEN}` },
  })
  if (!res.ok) return []
  const guilds = await res.json() as Array<{ id: string }>
  return guilds.map((g) => g.id)
}

export async function getGuildChannels(guildId: string) {
  if (!process.env.DISCORD_TOKEN) return []
  const res = await fetch(`${DISCORD_API}/guilds/${guildId}/channels`, {
    headers: { Authorization: `Bot ${process.env.DISCORD_TOKEN}` },
  })
  if (!res.ok) throw new Error("Failed to fetch channels")
  return res.json() as Promise<Array<{ id: string; name: string; type: number }>>
}

export async function checkBotInGuild(guildId: string) {
  if (!process.env.DISCORD_TOKEN) return true
  try {
    const res = await fetch(`${DISCORD_API}/guilds/${guildId}`, {
      headers: { Authorization: `Bot ${process.env.DISCORD_TOKEN}` },
    })
    return res.status !== 404
  } catch {
    return true
  }
}

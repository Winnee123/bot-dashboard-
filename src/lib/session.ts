import { cookies } from "next/headers"
import { unsealData } from "iron-session"

export interface SessionData {
  userId?: string
  accessToken?: string
}

const PASSWORD = (process.env.SESSION_SECRET || "").padEnd(32, "x")
const COOKIE_NAME = "discord_dashboard_session"
const TTL = 60 * 60 * 24 * 7

export async function getSession(req?: Request): Promise<SessionData> {
  try {
    // En Next.js (server actions / route handlers) a veces no llega el header "cookie" en req
    // En ese caso, usamos cookies() para leer la cookie desde el contexto actual.
    let raw: string | undefined

    const cookieHeader = req?.headers?.get?.("cookie") ?? null
    if (cookieHeader) {
      const map: Record<string, string> = {}
      for (const c of cookieHeader.split(";")) {
        const idx = c.indexOf("=")
        if (idx === -1) continue
        map[c.slice(0, idx).trim()] = c.slice(idx + 1).trim()
      }
      raw = map[COOKIE_NAME]
    } else {
      const store = await cookies()
      raw = store.get(COOKIE_NAME)?.value
    }

    if (!raw) return {}

    return (await unsealData(raw, { password: PASSWORD, ttl: TTL })) as SessionData
  } catch (err) {
    // Log mínimo para depurar en producción sin imprimir cookies
    console.error("[session] getSession failed:", err instanceof Error ? err.message : String(err))
    return {}
  }
}


export async function sealSession(data: SessionData) {
  const { sealData } = await import("iron-session")
  return sealData(data, { password: PASSWORD, ttl: TTL })
}

export async function getWritableSession() {
  const { getIronSession } = await import("iron-session")
  const c = await cookies()
  return getIronSession<SessionData>(c, {
    password: PASSWORD,
    cookieName: COOKIE_NAME,
    ttl: TTL,
    cookieOptions: {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      sameSite: "lax" as const,
      maxAge: TTL,
      path: "/",
    },
  })
}

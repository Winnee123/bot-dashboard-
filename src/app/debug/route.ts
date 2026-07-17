import { getSession } from "@/lib/session"
import { NextRequest } from "next/server"

export async function GET(req: NextRequest) {
  const session = await getSession(req)
  const cookieHeader = req.headers.get("cookie") || "(none)"
  const hasOurCookie = cookieHeader.includes("discord_dashboard_session")

  return Response.json({
    session: { userId: session.userId || null, hasAccessToken: !!session.accessToken },
    cookies: {
      raw: cookieHeader.substring(0, 200) + (cookieHeader.length > 200 ? "..." : ""),
      hasOurCookie,
    },
    env: {
      DISCORD_CLIENT_ID: process.env.DISCORD_CLIENT_ID ? "set" : "MISSING",
      DISCORD_CLIENT_SECRET: process.env.DISCORD_CLIENT_SECRET ? "set" : "MISSING",
      DISCORD_REDIRECT_URI: process.env.DISCORD_REDIRECT_URI || "MISSING",
      DISCORD_TOKEN: process.env.DISCORD_TOKEN ? "set" : "MISSING",
      SESSION_SECRET: process.env.SESSION_SECRET ? `set (len=${process.env.SESSION_SECRET.length})` : "MISSING",
    },
  })
}

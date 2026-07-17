import { exchangeCode, getUser } from "@/lib/discord"
import { sealSession } from "@/lib/session"
import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code")
  if (!code) return new Response("Missing code", { status: 400 })

  try {
    const token = await exchangeCode(code)
    const discordUser = await getUser(token.access_token)
    const seal = await sealSession({ userId: discordUser.id, accessToken: token.access_token })

    const res = NextResponse.redirect(new URL("/dashboard", req.url))
    res.cookies.set("discord_dashboard_session", seal, {
      path: "/",
      httpOnly: true,
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      secure: process.env.NODE_ENV === "production",
    })
    return res
  } catch (e: any) {
    console.error("Callback error:", e)
    return new Response(JSON.stringify({
      error: e?.message || String(e),
      env: {
        DISCORD_CLIENT_ID: process.env.DISCORD_CLIENT_ID ? "set" : "MISSING",
        DISCORD_CLIENT_SECRET: process.env.DISCORD_CLIENT_SECRET ? "set" : "MISSING",
        DISCORD_REDIRECT_URI: process.env.DISCORD_REDIRECT_URI || "MISSING",
        DISCORD_TOKEN: process.env.DISCORD_TOKEN ? "set" : "MISSING",
        SESSION_SECRET: process.env.SESSION_SECRET ? "set" : "MISSING",
      }
    }), { status: 500, headers: { "content-type": "application/json" } })
  }
}

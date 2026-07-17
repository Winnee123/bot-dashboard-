import { NextResponse } from "next/server"

export async function GET() {
  const res = NextResponse.redirect(new URL("/", process.env.NEXT_PUBLIC_BASE_URL || "https://winnebot.vercel.app"))
  res.cookies.set("discord_dashboard_session", "", { maxAge: 0, path: "/" })
  return res
}

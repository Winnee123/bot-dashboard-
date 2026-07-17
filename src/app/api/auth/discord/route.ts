import { getOAuthUrl } from "@/lib/discord"
import { NextResponse } from "next/server"

export async function GET() {
  return NextResponse.redirect(getOAuthUrl())
}

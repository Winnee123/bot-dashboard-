import { getSession } from "@/lib/session"
import { getReactionRoles, addReactionRole, deleteReactionRole } from "@/lib/db"
import { NextRequest } from "next/server"

export async function GET(req: NextRequest, { params }: { params: Promise<{ guildId: string }> }) {
  const session = await getSession(req)
  if (!session.userId) return Response.json({ error: "Unauthorized" }, { status: 401 })
  const { guildId } = await params
  const roles = await getReactionRoles(guildId)
  return Response.json({ roles })
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ guildId: string }> }) {
  const session = await getSession(req)
  if (!session.userId) return Response.json({ error: "Unauthorized" }, { status: 401 })
  const { guildId } = await params
  const body = await req.json()
  await addReactionRole({ guild_id: guildId, ...body })
  return Response.json({ success: true })
}

export async function DELETE(req: NextRequest) {
  const session = await getSession(req)
  if (!session.userId) return Response.json({ error: "Unauthorized" }, { status: 401 })
  const { searchParams } = new URL(req.url)
  const id = Number(searchParams.get("id"))
  if (!id) return Response.json({ error: "Missing id" }, { status: 400 })
  await deleteReactionRole(id)
  return Response.json({ success: true })
}

import { createTables } from "@/lib/db"

export async function GET() {
  try {
    await createTables()
    return Response.json({ success: true, message: "Tablas creadas" })
  } catch (e: any) {
    return Response.json({ success: false, error: e?.message || String(e) }, { status: 500 })
  }
}

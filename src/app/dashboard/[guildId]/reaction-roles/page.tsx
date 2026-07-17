"use client"

import { useState, useEffect } from "react"
import { Save, Hash, Trash2 } from "lucide-react"
import { ChannelSelect } from "@/components/ChannelSelect"

export default function ReactionRolesPage({ params }: { params: Promise<{ guildId: string }> }) {
  const [guildId, setGuildId] = useState("")
  const [roles, setRoles] = useState<any[]>([])
  const [channelId, setChannelId] = useState("")
  const [messageId, setMessageId] = useState("")
  const [emoji, setEmoji] = useState("")
  const [roleId, setRoleId] = useState("")
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => { params.then((p) => setGuildId(p.guildId)) }, [params])
  const loadRoles = () => {
    if (!guildId) return
    fetch(`/api/config/${guildId}/reaction-roles`, { credentials: "include" }).then((r) => r.json()).then((d) => setRoles(d.roles || [])).catch(() => {})
  }
  useEffect(() => { loadRoles() }, [guildId])

  async function handleAdd() {
    if (!channelId || !messageId || !emoji || !roleId) return
    setSaving(true)
    try {
      await fetch(`/api/config/${guildId}/reaction-roles`, { method: "POST", headers: { "Content-Type": "application/json" }, credentials: "include", body: JSON.stringify({ channel_id: channelId, message_id: messageId, emoji, role_id: roleId }) })
      setChannelId(""); setMessageId(""); setEmoji(""); setRoleId("")
      loadRoles()
      setSaved(true); setTimeout(() => setSaved(false), 2000)
    } catch {}
    setSaving(false)
  }

  async function handleDelete(id: number) {
    await fetch(`/api/config/${guildId}/reaction-roles?id=${id}`, { method: "DELETE", credentials: "include" })
    loadRoles()
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-[var(--discord-input-bg)] text-purple-400"><Hash className="w-5 h-5" /></div>
        <div><h1 className="text-xl font-bold">Reaction Roles</h1><p className="text-sm text-[var(--discord-text-muted)]">Roles por reacción automáticos</p></div>
      </div>
      <div className="space-y-4 p-4 bg-[var(--discord-darker)] rounded-lg border border-[var(--discord-hover)]">
        <h3 className="text-sm font-medium">Añadir reaction role</h3>
        <ChannelSelect guildId={guildId} value={channelId} onChange={setChannelId} placeholder="Canal del mensaje..." />
        <input type="text" value={messageId} onChange={(e) => setMessageId(e.target.value)} placeholder="ID del mensaje"
          className="w-full px-3 py-2 bg-[var(--discord-input-bg)] border border-[var(--discord-hover)] rounded-lg text-sm focus:outline-none focus:border-[var(--discord-blurple)]" />
        <div className="flex gap-2">
          <input type="text" value={emoji} onChange={(e) => setEmoji(e.target.value)} placeholder="Emoji"
            className="flex-1 px-3 py-2 bg-[var(--discord-input-bg)] border border-[var(--discord-hover)] rounded-lg text-sm focus:outline-none focus:border-[var(--discord-blurple)]" />
          <input type="text" value={roleId} onChange={(e) => setRoleId(e.target.value)} placeholder="ID del rol"
            className="flex-1 px-3 py-2 bg-[var(--discord-input-bg)] border border-[var(--discord-hover)] rounded-lg text-sm focus:outline-none focus:border-[var(--discord-blurple)]" />
        </div>
        <button onClick={handleAdd} disabled={saving || !channelId || !messageId || !emoji || !roleId}
          className="flex items-center gap-2 px-4 py-2 bg-[var(--discord-blurple)] hover:bg-[#4752C4] disabled:opacity-50 rounded-lg text-sm font-medium transition-colors">
          <Save className="w-4 h-4" />{saving ? "Añadiendo..." : saved ? "¡Añadido!" : "Añadir"}
        </button>
      </div>
      {roles.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-sm font-medium">Roles configurados</h3>
          {roles.map((r: any) => (
            <div key={r.id} className="flex items-center justify-between p-3 bg-[var(--discord-darker)] rounded-lg border border-[var(--discord-hover)] text-sm">
              <span>{r.emoji} → <code className="bg-[var(--discord-input-bg)] px-1 py-0.5 rounded">{r.role_id}</code> (msg: {r.message_id?.slice(0, 8)}...)</span>
              <button onClick={() => handleDelete(r.id)} className="text-[var(--discord-red)] hover:opacity-80"><Trash2 className="w-4 h-4" /></button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

"use client"

import { useState, useEffect } from "react"
import { Save, DoorOpen } from "lucide-react"
import { ChannelSelect } from "@/components/ChannelSelect"

export default function WelcomePage({ params }: { params: Promise<{ guildId: string }> }) {
  const [guildId, setGuildId] = useState("")
  const [channelId, setChannelId] = useState("")
  const [message, setMessage] = useState("")
  const [enabled, setEnabled] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => { params.then((p) => setGuildId(p.guildId)) }, [params])
  useEffect(() => {
    if (!guildId) return
    fetch(`/api/config/${guildId}/welcome`, { credentials: "include" }).then((r) => r.json()).then((d) => {
      if (d.config) { setChannelId(d.config.channel_id || ""); setMessage(d.config.message || ""); setEnabled(d.config.enabled || false) }
    }).catch(() => {})
  }, [guildId])

  async function handleSave() {
    setSaving(true)
    try {
      await fetch(`/api/config/${guildId}/welcome`, { method: "PUT", headers: { "Content-Type": "application/json" }, credentials: "include", body: JSON.stringify({ channel_id: channelId || null, message, enabled }) })
      setSaved(true); setTimeout(() => setSaved(false), 2000)
    } catch {}
    setSaving(false)
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-[var(--discord-input-bg)] text-green-400"><DoorOpen className="w-5 h-5" /></div>
        <div><h1 className="text-xl font-bold">Bienvenidas</h1><p className="text-sm text-[var(--discord-text-muted)]">Configura el mensaje de bienvenida</p></div>
      </div>
      <div className="space-y-4">
        <label className="block"><span className="text-sm font-medium">Canal de bienvenida</span><ChannelSelect guildId={guildId} value={channelId} onChange={setChannelId} placeholder="Seleccionar canal..." /></label>
        <label className="block"><span className="text-sm font-medium">Mensaje</span>
          <textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={4}
            placeholder='¡Hola {user}! Bienvenido a {server}. Somos {count} miembros'
            className="mt-1 w-full px-3 py-2 bg-[var(--discord-input-bg)] border border-[var(--discord-hover)] rounded-lg text-sm focus:outline-none focus:border-[var(--discord-blurple)] resize-none" />
          <p className="mt-1 text-xs text-[var(--discord-text-muted)]">Variables: {'{user}'} (mención), {'{server}'} (nombre), {'{count}'} (miembros)</p>
        </label>
        <div className="bg-[var(--discord-darker)] border border-[var(--discord-hover)] rounded-lg p-4 flex items-center justify-between">
          <div><h3 className="text-sm font-medium">Habilitadas</h3><p className="text-xs text-[var(--discord-text-muted)]">Activar mensajes de bienvenida</p></div>
          <button onClick={() => setEnabled(!enabled)} className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${enabled ? "bg-[var(--discord-green)]" : "bg-[var(--discord-input-bg)]"}`}>
            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${enabled ? "translate-x-6" : "translate-x-1"}`} />
          </button>
        </div>
      </div>
      <button onClick={handleSave} disabled={saving}
        className="flex items-center gap-2 px-4 py-2 bg-[var(--discord-blurple)] hover:bg-[#4752C4] disabled:opacity-50 rounded-lg text-sm font-medium transition-colors">
        <Save className="w-4 h-4" />{saving ? "Guardando..." : saved ? "¡Guardado!" : "Guardar cambios"}
      </button>
    </div>
  )
}

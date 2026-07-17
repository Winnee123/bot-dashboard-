"use client"

import { useState, useEffect } from "react"
import { Save, ScrollText } from "lucide-react"
import { ChannelSelect } from "@/components/ChannelSelect"

export default function LogsPage({ params }: { params: Promise<{ guildId: string }> }) {
  const [guildId, setGuildId] = useState("")
  const [config, setConfig] = useState<any>({})
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => { params.then((p) => setGuildId(p.guildId)) }, [params])
  useEffect(() => {
    if (!guildId) return
    fetch(`/api/config/${guildId}/logs`, { credentials: "include" }).then((r) => r.json()).then((d) => { if (d.config) setConfig(d.config) }).catch(() => {})
  }, [guildId])

  const toggle = (key: string) => setConfig({ ...config, [key]: !config[key] })
  const events = [
    { key: "log_joins", label: "Entradas de miembros" },
    { key: "log_leaves", label: "Salidas de miembros" },
    { key: "log_deletes", label: "Mensajes eliminados" },
    { key: "log_edits", label: "Mensajes editados" },
    { key: "log_avatar_changes", label: "Cambios de avatar" },
    { key: "log_name_changes", label: "Cambios de nombre" },
  ]

  async function handleSave() {
    setSaving(true)
    try {
      await fetch(`/api/config/${guildId}/logs`, { method: "PUT", headers: { "Content-Type": "application/json" }, credentials: "include", body: JSON.stringify(config) })
      setSaved(true); setTimeout(() => setSaved(false), 2000)
    } catch {}
    setSaving(false)
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-[var(--discord-input-bg)] text-[var(--discord-green)]"><ScrollText className="w-5 h-5" /></div>
        <div><h1 className="text-xl font-bold">Logs</h1><p className="text-sm text-[var(--discord-text-muted)]">Configura los canales y eventos de auditoría</p></div>
      </div>
      <div className="space-y-4">
        <label className="block"><span className="text-sm font-medium">Canal de logs</span><ChannelSelect guildId={guildId} value={config.channel_id || ""} onChange={(v) => setConfig({ ...config, channel_id: v })} placeholder="Seleccionar canal..." /></label>
        <div className="bg-[var(--discord-darker)] border border-[var(--discord-hover)] rounded-lg p-4 flex items-center justify-between">
          <div><h3 className="text-sm font-medium">Logs habilitados</h3></div>
          <button onClick={() => toggle("enabled")} className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${config.enabled ? "bg-[var(--discord-green)]" : "bg-[var(--discord-input-bg)]"}`}>
            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${config.enabled ? "translate-x-6" : "translate-x-1"}`} />
          </button>
        </div>
        <div className="space-y-2">
          <h3 className="text-sm font-medium">Eventos a registrar</h3>
          {events.map((e) => (
            <div key={e.key} className="flex items-center justify-between p-3 bg-[var(--discord-darker)] rounded-lg border border-[var(--discord-hover)]">
              <span className="text-sm">{e.label}</span>
              <button onClick={() => toggle(e.key)} className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${config[e.key] !== false ? "bg-[var(--discord-blurple)]" : "bg-[var(--discord-input-bg)]"}`}>
                <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${config[e.key] !== false ? "translate-x-[18px]" : "translate-x-1"}`} />
              </button>
            </div>
          ))}
        </div>
      </div>
      <button onClick={handleSave} disabled={saving}
        className="flex items-center gap-2 px-4 py-2 bg-[var(--discord-blurple)] hover:bg-[#4752C4] disabled:opacity-50 rounded-lg text-sm font-medium transition-colors">
        <Save className="w-4 h-4" />{saving ? "Guardando..." : saved ? "¡Guardado!" : "Guardar cambios"}
      </button>
    </div>
  )
}

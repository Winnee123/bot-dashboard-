"use client"

import { useState, useEffect } from "react"
import { Save, Shield } from "lucide-react"
import { ChannelSelect } from "@/components/ChannelSelect"

export default function ModerationPage({ params }: { params: Promise<{ guildId: string }> }) {
  const [guildId, setGuildId] = useState("")
  const [config, setConfig] = useState<any>({})
  const [warnings, setWarnings] = useState<any[]>([])
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => { params.then((p) => setGuildId(p.guildId)) }, [params])
  useEffect(() => {
    if (!guildId) return
    fetch(`/api/config/${guildId}/moderation`, { credentials: "include" }).then((r) => r.json()).then((d) => {
      if (d.config) setConfig(d.config); if (d.warnings) setWarnings(d.warnings)
    }).catch(() => {})
  }, [guildId])

  async function handleSave() {
    setSaving(true)
    try {
      await fetch(`/api/config/${guildId}/moderation`, { method: "PUT", headers: { "Content-Type": "application/json" }, credentials: "include", body: JSON.stringify(config) })
      setSaved(true); setTimeout(() => setSaved(false), 2000)
    } catch {}
    setSaving(false)
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-[var(--discord-input-bg)] text-[var(--discord-yellow)]"><Shield className="w-5 h-5" /></div>
        <div><h1 className="text-xl font-bold">Moderación</h1><p className="text-sm text-[var(--discord-text-muted)]">Gestiona advertencias y auto-mod</p></div>
      </div>
      <div className="space-y-4">
        <label className="block"><span className="text-sm font-medium">Canal de advertencias</span><ChannelSelect guildId={guildId} value={config.warn_channel_id || ""} onChange={(v) => setConfig({ ...config, warn_channel_id: v })} placeholder="Seleccionar canal..." /></label>
        <label className="block"><span className="text-sm font-medium">Canal de logs de moderación</span><ChannelSelect guildId={guildId} value={config.mod_log_channel_id || ""} onChange={(v) => setConfig({ ...config, mod_log_channel_id: v })} placeholder="Seleccionar canal..." /></label>
        <label className="block"><span className="text-sm font-medium">Rol de mute</span>
          <input type="text" value={config.mute_role_id || ""} onChange={(e) => setConfig({ ...config, mute_role_id: e.target.value })} placeholder="ID del rol"
            className="mt-1 w-full px-3 py-2 bg-[var(--discord-input-bg)] border border-[var(--discord-hover)] rounded-lg text-sm focus:outline-none focus:border-[var(--discord-blurple)]" />
        </label>
        <div className="grid grid-cols-3 gap-4">
          <label className="block"><span className="text-sm font-medium">Mute</span>
            <input type="number" value={config.warn_threshold_mute || 0} onChange={(e) => setConfig({ ...config, warn_threshold_mute: Number(e.target.value) })}
              className="mt-1 w-full px-3 py-2 bg-[var(--discord-input-bg)] border border-[var(--discord-hover)] rounded-lg text-sm focus:outline-none focus:border-[var(--discord-blurple)]" />
            <p className="text-xs text-[var(--discord-text-muted)] mt-1">0 = desactivado</p>
          </label>
          <label className="block"><span className="text-sm font-medium">Kick</span>
            <input type="number" value={config.warn_threshold_kick || 0} onChange={(e) => setConfig({ ...config, warn_threshold_kick: Number(e.target.value) })}
              className="mt-1 w-full px-3 py-2 bg-[var(--discord-input-bg)] border border-[var(--discord-hover)] rounded-lg text-sm focus:outline-none focus:border-[var(--discord-blurple)]" />
            <p className="text-xs text-[var(--discord-text-muted)] mt-1">0 = desactivado</p>
          </label>
          <label className="block"><span className="text-sm font-medium">Ban</span>
            <input type="number" value={config.warn_threshold_ban || 0} onChange={(e) => setConfig({ ...config, warn_threshold_ban: Number(e.target.value) })}
              className="mt-1 w-full px-3 py-2 bg-[var(--discord-input-bg)] border border-[var(--discord-hover)] rounded-lg text-sm focus:outline-none focus:border-[var(--discord-blurple)]" />
            <p className="text-xs text-[var(--discord-text-muted)] mt-1">0 = desactivado</p>
          </label>
        </div>
      </div>
      <button onClick={handleSave} disabled={saving}
        className="flex items-center gap-2 px-4 py-2 bg-[var(--discord-blurple)] hover:bg-[#4752C4] disabled:opacity-50 rounded-lg text-sm font-medium transition-colors">
        <Save className="w-4 h-4" />{saving ? "Guardando..." : saved ? "¡Guardado!" : "Guardar cambios"}
      </button>
      {warnings.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold mb-3">Advertencias recientes</h2>
          <div className="space-y-2">
            {warnings.map((w: any) => (
              <div key={w.id} className="p-3 bg-[var(--discord-darker)] rounded-lg border border-[var(--discord-hover)] text-sm">
                <p><strong>{w.username}</strong> — {w.reason}</p>
                <p className="text-xs text-[var(--discord-text-muted)]">Mod: {w.moderator_name}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

"use client"

import { useState, useEffect } from "react"
import { Save, Trophy } from "lucide-react"
import { ChannelSelect } from "@/components/ChannelSelect"

export default function LevelsPage({ params }: { params: Promise<{ guildId: string }> }) {
  const [guildId, setGuildId] = useState("")
  const [config, setConfig] = useState<any>({})
  const [leaderboard, setLeaderboard] = useState<any[]>([])
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => { params.then((p) => setGuildId(p.guildId)) }, [params])
  useEffect(() => {
    if (!guildId) return
    fetch(`/api/config/${guildId}/levels`, { credentials: "include" }).then((r) => r.json()).then((d) => { if (d.config) setConfig(d.config) }).catch(() => {})
    fetch(`/api/config/${guildId}/levels/leaderboard`, { credentials: "include" }).then((r) => r.json()).then((d) => setLeaderboard(d.leaderboard || [])).catch(() => {})
  }, [guildId])

  async function handleSave() {
    setSaving(true)
    try {
      await fetch(`/api/config/${guildId}/levels`, { method: "PUT", headers: { "Content-Type": "application/json" }, credentials: "include", body: JSON.stringify(config) })
      setSaved(true); setTimeout(() => setSaved(false), 2000)
    } catch {}
    setSaving(false)
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-[var(--discord-input-bg)] text-yellow-400"><Trophy className="w-5 h-5" /></div>
        <div><h1 className="text-xl font-bold">Niveles & XP</h1><p className="text-sm text-[var(--discord-text-muted)]">Sistema de experiencia por mensajes</p></div>
      </div>
      <div className="space-y-4">
        <div className="bg-[var(--discord-darker)] border border-[var(--discord-hover)] rounded-lg p-4 flex items-center justify-between">
          <div><h3 className="text-sm font-medium">Niveles habilitados</h3></div>
          <button onClick={() => setConfig({ ...config, enabled: !config.enabled })} className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${config.enabled ? "bg-[var(--discord-green)]" : "bg-[var(--discord-input-bg)]"}`}>
            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${config.enabled ? "translate-x-6" : "translate-x-1"}`} />
          </button>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <label className="block"><span className="text-sm font-medium">XP por mensaje</span>
            <input type="number" value={config.xp_per_message ?? 15} onChange={(e) => setConfig({ ...config, xp_per_message: Number(e.target.value) })}
              className="mt-1 w-full px-3 py-2 bg-[var(--discord-input-bg)] border border-[var(--discord-hover)] rounded-lg text-sm focus:outline-none focus:border-[var(--discord-blurple)]" />
          </label>
          <label className="block"><span className="text-sm font-medium">Cooldown (segundos)</span>
            <input type="number" value={config.cooldown_seconds ?? 60} onChange={(e) => setConfig({ ...config, cooldown_seconds: Number(e.target.value) })}
              className="mt-1 w-full px-3 py-2 bg-[var(--discord-input-bg)] border border-[var(--discord-hover)] rounded-lg text-sm focus:outline-none focus:border-[var(--discord-blurple)]" />
          </label>
        </div>
        <label className="block"><span className="text-sm font-medium">Canal de subida de nivel</span><ChannelSelect guildId={guildId} value={config.level_up_channel_id || ""} onChange={(v) => setConfig({ ...config, level_up_channel_id: v })} placeholder="Sin canal (DM al usuario)" /></label>
      </div>
      <button onClick={handleSave} disabled={saving}
        className="flex items-center gap-2 px-4 py-2 bg-[var(--discord-blurple)] hover:bg-[#4752C4] disabled:opacity-50 rounded-lg text-sm font-medium transition-colors">
        <Save className="w-4 h-4" />{saving ? "Guardando..." : saved ? "¡Guardado!" : "Guardar cambios"}
      </button>
      {leaderboard.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold mb-3">Top 10</h2>
          <div className="space-y-1">
            {leaderboard.map((u: any, i: number) => (
              <div key={u.user_id} className="flex items-center justify-between p-2 bg-[var(--discord-darker)] rounded text-sm">
                <span>#{i + 1} <code className="bg-[var(--discord-input-bg)] px-1 py-0.5 rounded">{u.user_id?.slice(0, 8)}...</code></span>
                <span className="text-[var(--discord-text-muted)]">Nv.{u.level} · {u.xp} XP</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

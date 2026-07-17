"use client"

import { useState, useEffect } from "react"
import { Save, Music } from "lucide-react"

export default function MusicPage({ params }: { params: Promise<{ guildId: string }> }) {
  const [guildId, setGuildId] = useState("")
  const [config, setConfig] = useState<any>({})
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => { params.then((p) => setGuildId(p.guildId)) }, [params])
  useEffect(() => {
    if (!guildId) return
    fetch(`/api/config/${guildId}/music`, { credentials: "include" }).then((r) => r.json()).then((d) => { if (d.config) setConfig(d.config) }).catch(() => {})
  }, [guildId])

  async function handleSave() {
    setSaving(true)
    try {
      await fetch(`/api/config/${guildId}/music`, { method: "PUT", headers: { "Content-Type": "application/json" }, credentials: "include", body: JSON.stringify(config) })
      setSaved(true); setTimeout(() => setSaved(false), 2000)
    } catch {}
    setSaving(false)
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-[var(--discord-input-bg)] text-[var(--discord-red)]"><Music className="w-5 h-5" /></div>
        <div><h1 className="text-xl font-bold">Música</h1><p className="text-sm text-[var(--discord-text-muted)]">Configuración de reproducción</p></div>
      </div>
      <div className="space-y-4">
        <label className="block"><span className="text-sm font-medium">Volumen predeterminado (0-100)</span>
          <input type="range" min={0} max={100} value={config.default_volume ?? 50} onChange={(e) => setConfig({ ...config, default_volume: Number(e.target.value) })}
            className="mt-1 w-full" />
          <span className="text-sm text-[var(--discord-text-muted)]">{config.default_volume ?? 50}%</span>
        </label>
        <label className="block"><span className="text-sm font-medium">Duración máxima (minutos, 0 = ilimitado)</span>
          <input type="number" value={config.max_duration || 0} onChange={(e) => setConfig({ ...config, max_duration: Number(e.target.value) })}
            className="mt-1 w-full px-3 py-2 bg-[var(--discord-input-bg)] border border-[var(--discord-hover)] rounded-lg text-sm focus:outline-none focus:border-[var(--discord-blurple)] max-w-[150px]" />
        </label>
        <div className="bg-[var(--discord-darker)] border border-[var(--discord-hover)] rounded-lg p-4 flex items-center justify-between">
          <div><h3 className="text-sm font-medium">Música habilitada</h3></div>
          <button onClick={() => setConfig({ ...config, enabled: !config.enabled })} className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${config.enabled !== false ? "bg-[var(--discord-green)]" : "bg-[var(--discord-input-bg)]"}`}>
            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${config.enabled !== false ? "translate-x-6" : "translate-x-1"}`} />
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

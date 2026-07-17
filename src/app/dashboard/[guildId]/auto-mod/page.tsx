"use client"

import { useState, useEffect } from "react"
import { Save, Gavel } from "lucide-react"

export default function AutoModPage({ params }: { params: Promise<{ guildId: string }> }) {
  const [guildId, setGuildId] = useState("")
  const [config, setConfig] = useState<any>({})
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => { params.then((p) => setGuildId(p.guildId)) }, [params])
  useEffect(() => {
    if (!guildId) return
    fetch(`/api/config/${guildId}/auto-mod`, { credentials: "include" }).then((r) => r.json()).then((d) => { if (d.config) setConfig(d.config) }).catch(() => {})
  }, [guildId])

  async function handleSave() {
    setSaving(true)
    try {
      await fetch(`/api/config/${guildId}/auto-mod`, { method: "PUT", headers: { "Content-Type": "application/json" }, credentials: "include", body: JSON.stringify(config) })
      setSaved(true); setTimeout(() => setSaved(false), 2000)
    } catch {}
    setSaving(false)
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-[var(--discord-input-bg)] text-orange-400"><Gavel className="w-5 h-5" /></div>
        <div><h1 className="text-xl font-bold">Auto-Mod</h1><p className="text-sm text-[var(--discord-text-muted)]">Palabras prohibidas y límites</p></div>
      </div>
      <div className="space-y-4">
        <div className="bg-[var(--discord-darker)] border border-[var(--discord-hover)] rounded-lg p-4 flex items-center justify-between">
          <div><h3 className="text-sm font-medium">Auto-Mod habilitado</h3></div>
          <button onClick={() => setConfig({ ...config, enabled: !config.enabled })} className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${config.enabled ? "bg-[var(--discord-green)]" : "bg-[var(--discord-input-bg)]"}`}>
            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${config.enabled ? "translate-x-6" : "translate-x-1"}`} />
          </button>
        </div>
        <label className="block"><span className="text-sm font-medium">Palabras prohibidas (separadas por coma)</span>
          <textarea value={config.banned_words || ""} onChange={(e) => setConfig({ ...config, banned_words: e.target.value })} rows={3}
            className="mt-1 w-full px-3 py-2 bg-[var(--discord-input-bg)] border border-[var(--discord-hover)] rounded-lg text-sm focus:outline-none focus:border-[var(--discord-blurple)] resize-none" />
        </label>
        <div className="grid grid-cols-2 gap-4">
          <label className="block"><span className="text-sm font-medium">Máx. menciones</span>
            <input type="number" value={config.max_mentions ?? 5} onChange={(e) => setConfig({ ...config, max_mentions: Number(e.target.value) })}
              className="mt-1 w-full px-3 py-2 bg-[var(--discord-input-bg)] border border-[var(--discord-hover)] rounded-lg text-sm focus:outline-none focus:border-[var(--discord-blurple)]" />
          </label>
          <label className="block"><span className="text-sm font-medium">Máx. enlaces</span>
            <input type="number" value={config.max_links ?? 3} onChange={(e) => setConfig({ ...config, max_links: Number(e.target.value) })}
              className="mt-1 w-full px-3 py-2 bg-[var(--discord-input-bg)] border border-[var(--discord-hover)] rounded-lg text-sm focus:outline-none focus:border-[var(--discord-blurple)]" />
          </label>
          <label className="block"><span className="text-sm font-medium">% máx. mayúsculas (0 = off)</span>
            <input type="number" value={config.max_caps || 0} onChange={(e) => setConfig({ ...config, max_caps: Number(e.target.value) })}
              className="mt-1 w-full px-3 py-2 bg-[var(--discord-input-bg)] border border-[var(--discord-hover)] rounded-lg text-sm focus:outline-none focus:border-[var(--discord-blurple)]" />
          </label>
          <label className="block"><span className="text-sm font-medium">Máx. duplicados (0 = off)</span>
            <input type="number" value={config.max_duplicates || 0} onChange={(e) => setConfig({ ...config, max_duplicates: Number(e.target.value) })}
              className="mt-1 w-full px-3 py-2 bg-[var(--discord-input-bg)] border border-[var(--discord-hover)] rounded-lg text-sm focus:outline-none focus:border-[var(--discord-blurple)]" />
          </label>
        </div>
        <label className="block"><span className="text-sm font-medium">Acción</span>
          <select value={config.warn_action || "delete"} onChange={(e) => setConfig({ ...config, warn_action: e.target.value })}
            className="mt-1 w-full px-3 py-2 bg-[var(--discord-input-bg)] border border-[var(--discord-hover)] rounded-lg text-sm focus:outline-none focus:border-[var(--discord-blurple)] max-w-[200px]">
            <option value="delete">Eliminar mensaje</option>
            <option value="warn">Advertir usuario</option>
          </select>
        </label>
      </div>
      <button onClick={handleSave} disabled={saving}
        className="flex items-center gap-2 px-4 py-2 bg-[var(--discord-blurple)] hover:bg-[#4752C4] disabled:opacity-50 rounded-lg text-sm font-medium transition-colors">
        <Save className="w-4 h-4" />{saving ? "Guardando..." : saved ? "¡Guardado!" : "Guardar cambios"}
      </button>
    </div>
  )
}

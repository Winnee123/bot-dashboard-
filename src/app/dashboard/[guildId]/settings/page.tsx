"use client"

import { useState, useEffect } from "react"
import { Save, Settings } from "lucide-react"

export default function SettingsPage({ params }: { params: Promise<{ guildId: string }> }) {
  const [guildId, setGuildId] = useState("")
  const [prefix, setPrefix] = useState("!")
  const [language, setLanguage] = useState("es")
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => { params.then((p) => setGuildId(p.guildId)) }, [params])
  useEffect(() => {
    if (!guildId) return
    fetch(`/api/config/${guildId}`, { credentials: "include" }).then((r) => r.json()).then((d) => {
      if (d.guild) { setPrefix(d.guild.prefix || "!"); setLanguage(d.guild.language || "es") }
    }).catch(() => {})
  }, [guildId])

  async function handleSave() {
    setSaving(true)
    try {
      await fetch(`/api/config/${guildId}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, credentials: "include", body: JSON.stringify({ prefix, language }) })
      setSaved(true); setTimeout(() => setSaved(false), 2000)
    } catch {}
    setSaving(false)
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-[var(--discord-input-bg)] text-[var(--discord-text-muted)]"><Settings className="w-5 h-5" /></div>
        <div><h1 className="text-xl font-bold">Ajustes</h1><p className="text-sm text-[var(--discord-text-muted)]">Configuración general del bot</p></div>
      </div>
      <div className="space-y-4">
        <label className="block"><span className="text-sm font-medium">Prefijo</span>
          <input type="text" value={prefix} onChange={(e) => setPrefix(e.target.value)} maxLength={3}
            className="mt-1 w-full px-3 py-2 bg-[var(--discord-input-bg)] border border-[var(--discord-hover)] rounded-lg text-sm focus:outline-none focus:border-[var(--discord-blurple)] max-w-[100px]" />
        </label>
        <label className="block"><span className="text-sm font-medium">Idioma</span>
          <select value={language} onChange={(e) => setLanguage(e.target.value)}
            className="mt-1 w-full px-3 py-2 bg-[var(--discord-input-bg)] border border-[var(--discord-hover)] rounded-lg text-sm focus:outline-none focus:border-[var(--discord-blurple)] max-w-[200px]">
            <option value="es">Español</option>
            <option value="en">English</option>
            <option value="pt">Português</option>
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

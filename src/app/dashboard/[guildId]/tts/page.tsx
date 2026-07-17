"use client"

import { useState, useEffect } from "react"
import { Save, MessageSquareText } from "lucide-react"
import { ChannelSelect } from "@/components/ChannelSelect"

export default function TTSPage({ params }: { params: Promise<{ guildId: string }> }) {
  const [guildId, setGuildId] = useState("")
  const [config, setConfig] = useState<any>({})
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => { params.then((p) => setGuildId(p.guildId)) }, [params])
  useEffect(() => {
    if (!guildId) return
    fetch(`/api/config/${guildId}/tts`, { credentials: "include" }).then((r) => r.json()).then((d) => { if (d.config) setConfig(d.config) }).catch(() => {})
  }, [guildId])

  async function handleSave() {
    setSaving(true)
    try {
      await fetch(`/api/config/${guildId}/tts`, { method: "PUT", headers: { "Content-Type": "application/json" }, credentials: "include", body: JSON.stringify(config) })
      setSaved(true); setTimeout(() => setSaved(false), 2000)
    } catch {}
    setSaving(false)
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-[var(--discord-input-bg)] text-[var(--discord-blurple)]"><MessageSquareText className="w-5 h-5" /></div>
        <div><h1 className="text-xl font-bold">TTS</h1><p className="text-sm text-[var(--discord-text-muted)]">Configura el texto a voz</p></div>
      </div>
      <div className="space-y-4">
        <label className="block"><span className="text-sm font-medium">Canal de escucha</span><ChannelSelect guildId={guildId} value={config.listen_text_channel_id || ""} onChange={(v) => setConfig({ ...config, listen_text_channel_id: v })} placeholder="Seleccionar canal..." /></label>
        <label className="block"><span className="text-sm font-medium">Voz / idioma</span>
          <select value={config.voice_language || "es-ES"} onChange={(e) => setConfig({ ...config, voice_language: e.target.value })}
            className="mt-1 w-full px-3 py-2 bg-[var(--discord-input-bg)] border border-[var(--discord-hover)] rounded-lg text-sm focus:outline-none focus:border-[var(--discord-blurple)] max-w-[200px]">
            <option value="es-ES">Español (España)</option>
            <option value="es-MX">Español (México)</option>
            <option value="en-US">English (US)</option>
            <option value="en-GB">English (UK)</option>
            <option value="pt-BR">Português (Brasil)</option>
            <option value="fr-FR">Français</option>
            <option value="de-DE">Deutsch</option>
            <option value="ja-JP">日本語</option>
            <option value="ko-KR">한국어</option>
          </select>
        </label>
        <div className="bg-[var(--discord-darker)] border border-[var(--discord-hover)] rounded-lg p-4 flex items-center justify-between">
          <div><h3 className="text-sm font-medium">TTS habilitado</h3></div>
          <button onClick={() => setConfig({ ...config, enabled: !config.enabled })} className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${config.enabled ? "bg-[var(--discord-green)]" : "bg-[var(--discord-input-bg)]"}`}>
            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${config.enabled ? "translate-x-6" : "translate-x-1"}`} />
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

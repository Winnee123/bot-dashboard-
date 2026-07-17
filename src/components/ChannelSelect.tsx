"use client"

import { useState, useEffect } from "react"

interface Channel { id: string; name: string }

export function ChannelSelect({ guildId, value, onChange, placeholder = "Seleccionar canal..." }: {
  guildId: string; value: string; onChange: (v: string) => void; placeholder?: string
}) {
  const [channels, setChannels] = useState<Channel[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    if (!guildId) return

    let cancelled = false

    // Evita re-renders en cadena: primero marcamos estado "cargando" y luego iniciamos fetch
    setLoading(true)
    setError("")

    fetch(`/api/channels/${guildId}`, { credentials: "include" })
      .then((r) => r.json())
      .then((data) => {
        if (cancelled) return
        if (data.error) {
          setError(data.error)
          setChannels([])
        } else {
          setChannels(data.channels || [])
        }
        setLoading(false)
      })
      .catch((e) => {
        if (cancelled) return
        setError(e?.message || "Error de red")
        setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [guildId])

  if (error) return <div className="mt-1 px-3 py-2 bg-red-900/30 border border-red-500/50 rounded-lg text-sm text-red-400">Error: {error}</div>

  return (
    <select value={value} onChange={(e) => onChange(e.target.value)}
      className="mt-1 w-full px-3 py-2 bg-[var(--discord-input-bg)] border border-[var(--discord-hover)] rounded-lg text-sm focus:outline-none focus:border-[var(--discord-blurple)]">
      <option value="">{loading ? "Cargando..." : channels.length === 0 ? "No hay canales" : placeholder}</option>
      {channels.map((c) => <option key={c.id} value={c.id}>#{c.name}</option>)}
    </select>
  )
}

"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Search } from "lucide-react"

interface Guild { id: string; name: string; icon: string | null; hasBot: boolean }

const CLIENT_ID = process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID || ""

export default function DashboardPage() {
  const [guilds, setGuilds] = useState<Guild[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")

  useEffect(() => {
    fetch("/api/guilds", { credentials: "include" })
      .then((r) => { if (r.status === 401) window.location.href = "/login"; return r.json() })
      .then((d) => { setGuilds(d.guilds || []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const filtered = guilds.filter((g) => g.name.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="max-w-6xl mx-auto p-8 space-y-6">
      <h1 className="text-2xl font-bold">Seleccionar un servidor</h1>
      <p className="text-[var(--discord-text-muted)]">Administra la configuración del bot en tus servidores</p>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--discord-text-muted)]" />
        <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar servidores..."
          className="w-full pl-10 pr-4 py-3 bg-[var(--discord-input-bg)] border border-[var(--discord-hover)] rounded-lg text-sm focus:outline-none focus:border-[var(--discord-blurple)]" />
      </div>

      <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {loading ? Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="bg-[var(--discord-darker)] rounded-xl border border-[var(--discord-hover)] overflow-hidden animate-pulse">
            <div className="h-20 bg-[var(--discord-hover)]" />
            <div className="flex flex-col items-center px-4 pb-4">
              <div className="-mt-10 mb-3 w-16 h-16 rounded-full bg-[var(--discord-hover)] ring-4 ring-[var(--discord-darker)]" />
              <div className="h-4 w-28 bg-[var(--discord-hover)] rounded mb-2" />
              <div className="h-3 w-16 bg-[var(--discord-hover)] rounded mb-3" />
              <div className="h-9 w-full bg-[var(--discord-hover)] rounded-lg" />
            </div>
          </div>
        )) : filtered.map((guild) => (
          <div key={guild.id} className="bg-[var(--discord-darker)] rounded-xl border border-[var(--discord-hover)] overflow-hidden">
            <div className="relative h-20">
              {guild.icon ? <>
                <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png?size=128)` }} />
                <div className="absolute inset-0 backdrop-blur-md" />
              </> : <div className="absolute inset-0 bg-gradient-to-br from-[var(--discord-blurple)] to-purple-800" />}
            </div>
            <div className="relative flex flex-col items-center px-4 pb-4">
              <div className="-mt-10 mb-3">
                <div className="w-16 h-16 rounded-full overflow-hidden ring-4 ring-[var(--discord-darker)]">
                  {guild.icon ? <Image src={`https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png?size=128`} alt={guild.name} width={64} height={64} className="object-cover w-full h-full" />
                    : <div className="w-full h-full bg-[var(--discord-blurple)] flex items-center justify-center text-xl font-bold">{guild.name[0]}</div>}
                </div>
              </div>
              <h2 className="text-base font-medium truncate w-full text-center">{guild.name}</h2>
              <p className="text-xs text-[var(--discord-text-muted)] mt-0.5">{guild.hasBot ? "Disponible" : "Sin bot"}</p>
              <Link href={`/dashboard/${guild.id}`} className="mt-3 w-full block text-center px-4 py-2 bg-[var(--discord-blurple)] hover:bg-[#4752C4] rounded-lg text-sm font-medium transition-colors">
                Ir
              </Link>
            </div>
          </div>
        ))}
        <a href="https://discord.com/oauth2/authorize?client_id=1470197558315061288&permissions=8&response_type=code&redirect_uri=https%3A%2F%2Fwinnebot.vercel.app%2Fapi%2Fauth%2Fcallback&integration_type=0&scope=bot+identify+applications.commands+messages.read+voice+guilds+guilds.channels.read+connections+rpc.voice.read+account.global_name.update"
          target="_blank" rel="noopener noreferrer"
          className="flex items-center justify-center p-8 bg-[var(--discord-darker)] rounded-xl border-2 border-dashed border-[var(--discord-hover)] hover:bg-[var(--discord-hover)] hover:border-[var(--discord-blurple)] transition-colors min-h-[200px]">
          <p className="text-sm font-medium text-[var(--discord-text-muted)]">Invitar bot a otro servidor</p>
        </a>
      </div>
    </div>
  )
}

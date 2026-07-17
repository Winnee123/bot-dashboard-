"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { ScrollText, Music, Shield, MessageSquareText, Settings, DoorOpen, Hash, Gavel, Trophy } from "lucide-react"

export default function GuildDashboard({ params }: { params: Promise<{ guildId: string }> }) {
  const [guildId, setGuildId] = useState("")
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => { params.then((p) => setGuildId(p.guildId)) }, [params])

  useEffect(() => {
    if (!guildId) return
    fetch(`/api/config/${guildId}`, { credentials: "include" }).then((r) => r.json()).then((d) => { setData(d); setLoading(false) }).catch(() => setLoading(false))
  }, [guildId])

  if (loading) return <div className="flex items-center justify-center h-full"><div className="animate-spin rounded-full h-8 w-8 border-2 border-[var(--discord-blurple)] border-t-transparent" /></div>

  if (!data?.guild) return <div className="text-center text-[var(--discord-text-muted)] mt-10">No se pudo cargar la configuración</div>

  if (!data.hasBot) return (
    <div className="flex flex-col items-center justify-center h-full gap-6 text-center">
      <h2 className="text-xl font-bold">El bot no está en este servidor</h2>
      <p className="text-[var(--discord-text-muted)]">Invita al bot para administrar su configuración</p>
      <a href={`https://discord.com/oauth2/authorize?client_id=1470197558315061288&permissions=8&response_type=code&redirect_uri=https%3A%2F%2Fwinnebot.vercel.app%2Fapi%2Fauth%2Fcallback&integration_type=0&scope=bot+identify+applications.commands+messages.read+voice+guilds+guilds.channels.read+connections+rpc.voice.read+account.global_name.update&guild_id=${guildId}`}
        target="_blank" rel="noopener noreferrer"
        className="px-6 py-3 bg-[#5865F2] hover:bg-[#4752C4] rounded-lg font-medium transition-colors">Invitar bot</a>
    </div>
  )

  const cards = [
    { href: `/dashboard/${guildId}/logs`, icon: ScrollText, label: "Logs", desc: "Canales y eventos de auditoría", color: "text-[var(--discord-green)]" },
    { href: `/dashboard/${guildId}/tts`, icon: MessageSquareText, label: "TTS", desc: "Texto a voz", color: "text-[var(--discord-blurple)]" },
    { href: `/dashboard/${guildId}/moderation`, icon: Shield, label: "Moderación", desc: "Advertencias y auto-mod", color: "text-[var(--discord-yellow)]" },
    { href: `/dashboard/${guildId}/music`, icon: Music, label: "Música", desc: "Reproducción de música", color: "text-[var(--discord-red)]" },
    { href: `/dashboard/${guildId}/welcome`, icon: DoorOpen, label: "Bienvenidas", desc: "Mensaje y canal de bienvenida", color: "text-green-400" },
    { href: `/dashboard/${guildId}/reaction-roles`, icon: Hash, label: "Reaction Roles", desc: "Roles por reacción", color: "text-purple-400" },
    { href: `/dashboard/${guildId}/auto-mod`, icon: Gavel, label: "Auto-Mod", desc: "Palabras prohibidas y límites", color: "text-orange-400" },
    { href: `/dashboard/${guildId}/levels`, icon: Trophy, label: "Niveles", desc: "Sistema de experiencia", color: "text-yellow-400" },
    { href: `/dashboard/${guildId}/settings`, icon: Settings, label: "Ajustes", desc: "Configuración general", color: "text-[var(--discord-text-muted)]" },
  ]

  const guild = data.guild
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        {guild.icon ? <Image src={`https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png?size=128`} alt={guild.name} width={48} height={48} className="rounded-full" />
          : <div className="w-12 h-12 rounded-full bg-[var(--discord-blurple)] flex items-center justify-center text-xl font-bold">{guild.name[0]}</div>}
        <div>
          <h1 className="text-2xl font-bold">{guild.name}</h1>
          <p className="text-sm text-[var(--discord-text-muted)]">Prefijo: <code className="bg-[var(--discord-input-bg)] px-1.5 py-0.5 rounded">{guild.prefix}</code> · {guild.language?.toUpperCase()}</p>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {cards.map((card) => (
          <Link key={card.href} href={card.href}
            className="p-5 bg-[var(--discord-darker)] rounded-lg border border-[var(--discord-hover)] hover:bg-[var(--discord-hover)] transition-colors group">
            <div className="flex items-start gap-4">
              <div className={`p-2 rounded-lg bg-[var(--discord-input-bg)] ${card.color}`}><card.icon className="w-5 h-5" /></div>
              <div><h3 className="font-semibold group-hover:text-[var(--discord-blurple)] transition-colors">{card.label}</h3><p className="text-sm text-[var(--discord-text-muted)] mt-0.5">{card.desc}</p></div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

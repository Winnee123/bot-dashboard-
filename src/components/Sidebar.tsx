"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import Image from "next/image"
import { LayoutDashboard, ScrollText, Music, Shield, MessageSquareText, Settings, DoorOpen, Hash, Gavel, Trophy, LogOut } from "lucide-react"

interface Guild { id: string; name: string; icon: string | null; hasBot: boolean }

const navItems = [
  { href: "", label: "Resumen", icon: LayoutDashboard },
  { href: "/logs", label: "Logs", icon: ScrollText },
  { href: "/tts", label: "TTS", icon: MessageSquareText },
  { href: "/moderation", label: "Moderación", icon: Shield },
  { href: "/music", label: "Música", icon: Music },
  { href: "/welcome", label: "Bienvenidas", icon: DoorOpen },
  { href: "/reaction-roles", label: "Reaction Roles", icon: Hash },
  { href: "/auto-mod", label: "Auto-Mod", icon: Gavel },
  { href: "/levels", label: "Niveles", icon: Trophy },
  { href: "/settings", label: "Ajustes", icon: Settings },
]

export function DashboardSidebar() {
  const pathname = usePathname()
  const [guilds, setGuilds] = useState<Guild[]>([])
  const [open, setOpen] = useState(false)
  const currentId = pathname.split("/")[2]

  useEffect(() => {
    fetch("/api/guilds", { credentials: "include" }).then((r) => r.json()).then((d) => setGuilds(d.guilds || [])).catch(() => {})
  }, [])

  const guild = guilds.find((g) => g.id === currentId)

  return (
    <div className="w-60 bg-[var(--discord-sidebar)] flex flex-col h-full border-r border-[#1E1F22]">
      <div className="p-3 border-b border-[#1E1F22]">
        <button onClick={() => setOpen(!open)}
          className="w-full flex items-center gap-2 px-3 py-2 rounded hover:bg-[var(--discord-hover)] transition-colors text-left">
          {guild ? (
            <>
              {guild.icon ? <Image src={`https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png`} alt={guild.name} width={24} height={24} className="rounded-full" />
                : <div className="w-6 h-6 rounded-full bg-[var(--discord-blurple)] flex items-center justify-center text-xs font-bold">{guild.name[0]}</div>}
              <span className="flex-1 truncate text-sm font-medium">{guild.name}</span>
            </>
          ) : <span className="text-sm text-[var(--discord-text-muted)]">Servidor</span>}
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
        </button>
        {open && (
          <div className="mt-1 max-h-60 overflow-y-auto space-y-0.5">
            {guilds.map((g) => (
              <Link key={g.id} href={`/dashboard/${g.id}`} onClick={() => setOpen(false)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded text-sm transition-colors ${g.id === currentId ? "bg-[var(--discord-blurple)] text-white" : "hover:bg-[var(--discord-hover)] text-[var(--discord-text-muted)]"}`}>
                {g.icon ? <Image src={`https://cdn.discordapp.com/icons/${g.id}/${g.icon}.png`} alt={g.name} width={20} height={20} className="rounded-full" />
                  : <div className="w-5 h-5 rounded-full bg-[var(--discord-darker)] flex items-center justify-center text-xs">{g.name[0]}</div>}
                <span className="truncate flex-1">{g.name}</span>
                {!g.hasBot && <span className="text-[10px] text-yellow-500">Sin bot</span>}
              </Link>
            ))}
          </div>
        )}
      </div>
      <nav className="flex-1 p-2 space-y-0.5 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = item.href === "" ? pathname === `/dashboard/${currentId}` : pathname.includes(item.href)
          return (
            <Link key={item.href} href={`/dashboard/${currentId}${item.href}`}
              className={`flex items-center gap-3 px-3 py-2 rounded text-sm transition-colors ${isActive ? "bg-[var(--discord-blurple)] text-white" : "text-[var(--discord-text-muted)] hover:bg-[var(--discord-hover)] hover:text-[var(--discord-text)]"}`}>
              <item.icon className="w-4 h-4" /> {item.label}
            </Link>
          )
        })}
      </nav>
      <div className="p-2 border-t border-[#1E1F22]">
        <Link href="/api/auth/logout" className="flex items-center gap-3 px-3 py-2 rounded text-sm text-[var(--discord-text-muted)] hover:bg-[var(--discord-hover)] hover:text-[var(--discord-red)] transition-colors">
          <LogOut className="w-4 h-4" /> Cerrar sesión
        </Link>
      </div>
    </div>
  )
}

"use client"

const DISCORD_AUTH_URL = `https://discord.com/api/oauth2/authorize?client_id=${typeof window !== "undefined" ? (window as any).__NEXT_DATA__?.props?.pageProps?.discordClientId || "1470197558315061288" : "1470197558315061288"}&redirect_uri=${typeof window !== "undefined" ? encodeURIComponent(window.location.origin + "/api/auth/callback") : ""}&response_type=code&scope=identify%20guilds`

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 p-8 text-center">
      <h1 className="text-3xl font-bold">Iniciar sesión</h1>
      <p className="text-[var(--discord-text-muted)]">
        Conecta tu cuenta de Discord para administrar el bot
      </p>
      <a
        href="/api/auth/discord"
        className="px-6 py-3 bg-[#5865F2] hover:opacity-90 rounded-lg font-medium transition-opacity"
      >
        Iniciar sesión con Discord
      </a>
    </div>
  )
}

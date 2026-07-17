import Link from "next/link"

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 p-8 text-center">
      <h1 className="text-4xl font-bold">WinneBot Dashboard</h1>
      <p className="text-[var(--discord-text-muted)] max-w-md">
        Administra la configuración de tu bot de Discord
      </p>
      <Link
        href="/login"
        className="px-6 py-3 bg-[var(--discord-blurple)] hover:opacity-90 rounded-lg font-medium transition-opacity"
      >
        Iniciar sesión con Discord
      </Link>
    </div>
  )
}

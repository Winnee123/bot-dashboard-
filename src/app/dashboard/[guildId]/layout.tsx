import { DashboardSidebar } from "@/components/Sidebar"

export default function GuildLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen">
      <DashboardSidebar />
      <main className="flex-1 overflow-y-auto p-6">{children}</main>
    </div>
  )
}

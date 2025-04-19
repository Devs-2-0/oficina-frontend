import type React from "react"
import { DashboardSidebar } from "@/components/dashboard/sidebar"
import { Header } from "@/components/dashboard/header"
import { Outlet } from "react-router-dom"

export default function DashboardLayout() {
  return (
    <div className="min-h-screen bg-background " >
      <DashboardSidebar />
      <div className="flex flex-col min-h-screen ml-0 md:ml-24">
        <Header />
        <main className="flex-1 overflow-y-auto p-4"><Outlet /></main>
      </div>
    </div>
  )
}

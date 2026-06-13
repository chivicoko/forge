"use client"
import { useUser } from "@clerk/nextjs"
import { useState } from "react"
import { DashboardSidebar } from "./Sidebar"
import { Button } from "@/components/ui/button"
import { Menu, Sun, Moon } from "lucide-react"
import { useTheme } from "next-themes"

export function DashboardNavbar() {
  const { user } = useUser()
  const { theme, setTheme, resolvedTheme } = useTheme()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <>
      <header className="h-14 border-b bg-background flex items-center justify-between px-4 sticky top-0 z-30">
        <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setSidebarOpen(true)}>
          <Menu className="h-5 w-5" />
        </Button>
        <div className="hidden lg:block" />
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}>
            <Sun className="h-4 w-4 rotate-0 scale-100 dark:-rotate-90 dark:scale-0 transition-all" />
            <Moon className="absolute h-4 w-4 rotate-90 scale-0 dark:rotate-0 dark:scale-100 transition-all" />
          </Button>
          {user && (
            <div className="flex items-center gap-2 text-sm">
              <span className="font-semibold hidden sm:inline">{user.firstName}</span>
              <span className="w-8 h-8 rounded-full bg-amber-500 text-white flex items-center justify-center text-xs font-bold">
                {user.firstName?.[0]}{user.lastName?.[0]}
              </span>
            </div>
          )}
        </div>
      </header>
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
          <div className="absolute left-0 top-0 h-full w-64 bg-background shadow-xl">
            <DashboardSidebar />
          </div>
        </div>
      )}
    </>
  )
}

"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Package, Tag, ShoppingCart, DollarSign, Bell, Plus, LogOut } from "lucide-react"
import { useClerk } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"

const tabs = [
  { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { label: "Inventory", href: "/dashboard/inventory", icon: Package, action: { href: "/dashboard/inventory/add-product", icon: Plus } },
  { label: "Categories", href: "/dashboard/categories", icon: Tag },
  { label: "Orders", href: "/dashboard/orders", icon: ShoppingCart },
  { label: "Rates", href: "/dashboard/rates", icon: DollarSign },
  { label: "Notifications", href: "/dashboard/notifications", icon: Bell },
]

export function DashboardSidebar() {
  const pathname = usePathname()
  const { signOut } = useClerk()
  const isActive = (href: string) => href === "/dashboard" ? pathname === href : pathname.startsWith(href)

  return (
    <aside className="hidden lg:flex w-56 xl:w-64 shrink-0 flex-col bg-background border-r min-h-screen sticky top-0 h-screen">
      <div className="p-4 border-b">
        <Link href="/" className="flex items-center gap-2 font-black text-lg">
          <span className="text-amber-500">⬡</span> FORGE
        </Link>
        <p className="text-xs text-muted-foreground mt-0.5">Admin Dashboard</p>
      </div>
      <nav className="flex-1 p-3 space-y-1">
        {tabs.map(({ label, href, icon: Icon, action }) => (
          <div key={href} className={`flex items-center gap-1 rounded-lg transition-colors ${isActive(href) ? "bg-amber-500/10 text-amber-600 dark:text-amber-400" : "hover:bg-accent text-muted-foreground"}`}>
            <Link href={href} className="flex items-center gap-2.5 flex-1 px-3 py-2.5 text-sm font-semibold">
              <Icon className="h-4 w-4 shrink-0" />{label}
            </Link>
            {action && (
              <Link href={action.href} className="p-2 hover:text-amber-500 transition-colors" aria-label={`Add ${label}`}>
                <action.icon className="h-3.5 w-3.5" />
              </Link>
            )}
          </div>
        ))}
      </nav>
      <div className="p-3 border-t">
        <Button variant="outline" size="sm" className="w-full gap-2 text-destructive border-destructive/40 hover:border-destructive" onClick={() => signOut()}>
          <LogOut className="h-4 w-4" /> Sign Out
        </Button>
      </div>
    </aside>
  )
}

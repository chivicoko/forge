"use client"
export const dynamic = "force-dynamic"
import { useQuery } from "@tanstack/react-query"
import { listAllOrdersQueryOptions } from "@/lib/api"
import { Badge } from "@/components/ui/badge"
import { Bell, Package } from "lucide-react"
import { format } from "date-fns"

export default function NotificationsPage() {
  const { data: orders } = useQuery(listAllOrdersQueryOptions)
  const pendingOrders = orders?.filter(o => o.status === "pending") ?? []

  return (
    <div className="max-w-2xl space-y-5">
      <div><h1 className="text-2xl font-black">Notifications</h1><p className="text-sm text-muted-foreground">{pendingOrders.length} pending orders</p></div>

      <div className="bg-background border rounded-2xl overflow-hidden">
        {pendingOrders.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <Bell className="h-10 w-10 mx-auto mb-3 opacity-20" />
            <p className="font-semibold">All caught up!</p><p className="text-sm">No pending orders.</p>
          </div>
        ) : (
          <ul className="divide-y">
            {pendingOrders.map(order => (
              <li key={order.id} className="flex items-center gap-3 px-5 py-4 hover:bg-muted/30">
                <div className="w-9 h-9 rounded-xl bg-amber-500/10 flex items-center justify-center shrink-0">
                  <Package className="h-4 w-4 text-amber-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm">New order <span className="font-mono">{order.reference?.slice(0,10)}…</span></p>
                  <p className="text-xs text-muted-foreground truncate">{order.address}</p>
                </div>
                <div className="text-right shrink-0">
                  <Badge variant="warning" className="text-xs mb-1">Pending</Badge>
                  <p className="text-xs text-muted-foreground">{order.created_at ? format(new Date(order.created_at), "MMM d") : ""}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

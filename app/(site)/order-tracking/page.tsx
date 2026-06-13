"use client"
export const dynamic = "force-dynamic"
import { useQuery } from "@tanstack/react-query"
import { listUserOrdersQueryOptions } from "@/lib/api"
import { useUser, SignInButton } from "@clerk/nextjs"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Package, AlertCircle, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { format } from "date-fns"

const statusVariant: Record<string, "success" | "warning" | "destructive" | "default" | "secondary"> = {
  paid: "success", delivered: "success",
  processing: "warning", pending: "warning",
  shipped: "default", cancelled: "destructive",
}

export default function OrderTrackingPage() {
  const { isSignedIn, isLoaded } = useUser()
  const { data: orders, isLoading } = useQuery({
    ...listUserOrdersQueryOptions,
    enabled: !!isSignedIn,
  })

  if (!isLoaded) return null

  if (!isSignedIn) return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center max-w-sm">
        <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
        <h2 className="text-xl font-bold mb-2">Sign in to view your orders</h2>
        <p className="text-muted-foreground text-sm mb-6">Track your deliveries and order history from one place.</p>
        <SignInButton mode="modal">
          <Button className="bg-amber-500 hover:bg-amber-600 text-white">Sign In</Button>
        </SignInButton>
      </div>
    </div>
  )

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-black uppercase">My Orders</h1>
        <p className="text-muted-foreground mt-1 text-sm">{orders?.length ?? 0} order{orders?.length !== 1 ? "s" : ""} placed</p>
      </div>

      {isLoading ? (
        <div className="space-y-3">{Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-28 w-full rounded-2xl" />)}</div>
      ) : orders && orders.length > 0 ? (
        <div className="space-y-3">
          {orders.map(order => (
            <div key={order.id} className="bg-background border rounded-2xl p-5 hover:border-amber-500/50 transition-colors">
              <div className="flex items-center justify-between flex-wrap gap-3 mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center shrink-0">
                    <Package className="h-5 w-5 text-amber-500" />
                  </div>
                  <div>
                    <p className="font-bold text-sm">#{order.reference?.slice(0,16)}</p>
                    <p className="text-xs text-muted-foreground">
                      {order.created_at ? format(new Date(order.created_at), "MMM d, yyyy 'at' h:mm a") : "—"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant={statusVariant[order.status?.toLowerCase()] ?? "default"} className="capitalize">
                    {order.status}
                  </Badge>
                  <span className="font-black text-base">₦{(order.total_cost ?? 0).toLocaleString()}</span>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-2 text-sm text-muted-foreground border-t pt-3">
                <div>
                  <span className="text-xs uppercase tracking-wide font-semibold text-foreground/50">Delivery Address</span>
                  <p className="mt-0.5">{order.address}</p>
                </div>
                <div>
                  <span className="text-xs uppercase tracking-wide font-semibold text-foreground/50">Items</span>
                  <p className="mt-0.5">{(order.order_items as any[])?.length ?? 0} item(s)</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <Package className="h-16 w-16 mx-auto mb-4 opacity-10" />
          <p className="text-xl font-bold mb-2">No orders yet</p>
          <p className="text-muted-foreground text-sm mb-6">When you place an order it will appear here.</p>
          <Button asChild className="bg-amber-500 hover:bg-amber-600 text-white gap-2">
            <Link href="/store">Start Shopping <ArrowRight className="h-4 w-4" /></Link>
          </Button>
        </div>
      )}
    </div>
  )
}

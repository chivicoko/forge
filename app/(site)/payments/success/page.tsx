"use client"
export const dynamic = "force-dynamic"
import { useEffect } from "react"
import { useCart } from "@/stores/useCartStore"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { CheckCircle2, Package } from "lucide-react"
import { Suspense } from "react"

function SuccessContent() {
  const { clearCart } = useCart()
  const searchParams = useSearchParams()
  const orderId = searchParams.get("order_id")

  useEffect(() => { clearCart() }, [])

  return (
    <div className="text-center max-w-md mx-auto">
      <div className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center mx-auto mb-6">
        <CheckCircle2 className="h-10 w-10 text-green-600 dark:text-green-400" />
      </div>
      <h1 className="text-3xl font-black uppercase mb-3">Order Confirmed!</h1>
      <p className="text-muted-foreground mb-2">Your payment was successful. We&apos;ll process your order right away.</p>
      {orderId && <p className="text-xs text-muted-foreground mb-8 font-mono bg-muted px-3 py-1 rounded-full inline-block">Order ID: {orderId}</p>}
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Button asChild className="bg-amber-500 hover:bg-amber-600 text-white gap-2">
          <Link href="/order-tracking"><Package className="h-4 w-4" />Track Order</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/store">Continue Shopping</Link>
        </Button>
      </div>
    </div>
  )
}

export default function PaymentSuccessPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-20">
      <Suspense><SuccessContent /></Suspense>
    </div>
  )
}

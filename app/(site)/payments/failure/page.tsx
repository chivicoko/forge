export const dynamic = "force-dynamic"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { XCircle } from "lucide-react"

export default function PaymentFailurePage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center max-w-sm">
        <div className="w-20 h-20 rounded-full bg-red-100 dark:bg-red-900 flex items-center justify-center mx-auto mb-6">
          <XCircle className="h-10 w-10 text-destructive" />
        </div>
        <h1 className="text-3xl font-black uppercase mb-3">Payment Failed</h1>
        <p className="text-muted-foreground mb-8">Something went wrong. Your cart has been kept so you can try again.</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button asChild className="bg-amber-500 hover:bg-amber-600 text-white"><Link href="/checkout">Try Again</Link></Button>
          <Button asChild variant="outline"><Link href="/store">Back to Store</Link></Button>
        </div>
      </div>
    </div>
  )
}

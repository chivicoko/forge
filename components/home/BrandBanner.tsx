"use client"
import Marquee from "react-fast-marquee"
import { ShieldCheck, Truck, RotateCcw, CreditCard } from "lucide-react"

const perks = [
  { icon: Truck,       label: "Free Shipping Over $150" },
  { icon: ShieldCheck, label: "Secure Checkout" },
  { icon: RotateCcw,   label: "30-Day Returns" },
  { icon: CreditCard,  label: "Flexible Payment" },
]

export function BrandBanner() {
  return (
    <div className="border-y bg-muted/40 dark:bg-muted/20 py-3 overflow-hidden">
      <Marquee gradient={false} speed={40} pauseOnHover>
        {[...perks, ...perks].map(({ icon: Icon, label }, i) => (
          <div key={i} className="flex items-center gap-2 mx-10 text-sm font-semibold text-muted-foreground">
            <Icon className="h-4 w-4 text-amber-500 shrink-0" />
            <span>{label}</span>
          </div>
        ))}
      </Marquee>
    </div>
  )
}

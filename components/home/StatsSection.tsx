"use client"
import CountUp from "react-countup"
import { Package, Users, Globe, Star } from "lucide-react"

const stats = [
  { label: "Products", value: 200, suffix: "+", icon: Package, color: "bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300" },
  { label: "Happy Customers", value: 10, suffix: "K+", icon: Users, color: "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300" },
  { label: "Countries", value: 50, suffix: "+", icon: Globe, color: "bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300" },
  { label: "Rating", value: 4.9, suffix: "★", decimals: 1, icon: Star, color: "bg-amber-100 dark:bg-amber-900 text-amber-700 dark:text-amber-300" },
]

export function StatsSection() {
  return (
    <section className="py-16 bg-foreground text-background">
      <div className="max-w-5xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8">
        {stats.map(({ label, value, suffix, decimals, icon: Icon, color }) => (
          <div key={label} className="text-center">
            <div className={`w-12 h-12 rounded-xl ${color} flex items-center justify-center mx-auto mb-4`}>
              <Icon className="h-6 w-6" />
            </div>
            <div className="text-3xl md:text-4xl font-black">
              <CountUp end={value} duration={2.5} decimals={decimals} delay={0.5} />
              {suffix}
            </div>
            <p className="text-sm mt-1 opacity-70">{label}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

"use client"
import Link from "next/link"
import { ArrowRight, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Hero() {
  const scrollToFeatured = () => {
    document.getElementById("featured")?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-stone-50 dark:bg-neutral-950">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5 dark:opacity-10"
        style={{ backgroundImage: "radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)", backgroundSize: "40px 40px" }} />

      {/* Floating geometric shapes */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-32 right-20 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl" />

      <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400 text-sm font-medium mb-8">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
          New Collection 2025
        </div>

        <h1 className="text-6xl md:text-8xl lg:text-9xl font-black tracking-tight uppercase leading-none mb-6">
          <span className="block">FORGE</span>
          <span className="block text-amber-500">YOUR</span>
          <span className="block">STYLE</span>
        </h1>

        <p className="text-lg md:text-xl text-muted-foreground max-w-xl mx-auto mb-10 leading-relaxed">
          Premium men&apos;s bodywear crafted with intention. Built on quality, made to last, designed to move with you.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button asChild size="xl" className="bg-amber-500 hover:bg-amber-600 text-white rounded-full px-10 gap-2 text-base">
            <Link href="/store">Shop Now <ArrowRight className="h-5 w-5" /></Link>
          </Button>
          <Button asChild variant="outline" size="xl" className="rounded-full px-10 text-base">
            <Link href="/featured">View Featured</Link>
          </Button>
        </div>

        <div className="mt-16 grid grid-cols-3 gap-8 max-w-xs mx-auto text-center">
          {[["2K+", "Products"], ["50+", "Countries"], ["4.9★", "Rating"]].map(([val, label]) => (
            <div key={label}>
              <div className="text-2xl font-bold text-amber-500">{val}</div>
              <div className="text-xs text-muted-foreground uppercase tracking-wide">{label}</div>
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={scrollToFeatured}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-muted-foreground hover:text-foreground transition-colors animate-bounce"
        aria-label="Scroll down"
      >
        <span className="text-xs uppercase tracking-widest">Scroll</span>
        <ChevronDown className="h-4 w-4" />
      </button>
    </section>
  )
}

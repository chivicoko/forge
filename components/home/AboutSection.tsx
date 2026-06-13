"use client"
import { ArrowRight, Zap, Shield, Leaf } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

const pillars = [
  { icon: Zap,    title: "Performance",  desc: "Fabrics engineered to move with you — moisture-wicking, four-way stretch, built for real effort."  },
  { icon: Shield, title: "Durability",   desc: "Triple-stitched seams, preshrunk cotton. Each piece is stress-tested before it carries our name." },
  { icon: Leaf,   title: "Responsibility", desc: "Ethical sourcing, low-waste production. We believe looking good should never cost the planet."   },
]

export function AboutSection() {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-stone-50 dark:bg-neutral-900">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Text */}
          <div>
            <p className="text-amber-500 text-xs font-bold uppercase tracking-[0.2em] mb-4">
              The FORGE Story
            </p>
            <h2 className="text-4xl md:text-5xl font-black uppercase leading-none mb-6">
              Built for men <br className="hidden sm:block" />
              <span className="text-amber-500">who mean it.</span>
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              FORGE started with a simple observation: most men&apos;s bodywear is either too cheap to last or too stiff to live in. We decided to fix that.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-8">
              Every piece in our collection is designed from first principles — right fabric, right fit, right finish. No filler. No compromise. Just clothing that works as hard as you do.
            </p>
            <Button asChild className="bg-amber-500 hover:bg-amber-600 text-white rounded-full gap-2 px-8">
              <Link href="/store">Shop the Collection <ArrowRight className="h-4 w-4" /></Link>
            </Button>
          </div>

          {/* Pillars */}
          <div className="grid gap-5">
            {pillars.map(({ icon: Icon, title, desc }) => (
              <div key={title}
                className="flex gap-5 p-5 rounded-2xl bg-background border hover:border-amber-500/40 transition-colors group">
                <div className="w-11 h-11 rounded-xl bg-amber-500/10 flex items-center justify-center shrink-0 group-hover:bg-amber-500 transition-colors">
                  <Icon className="h-5 w-5 text-amber-500 group-hover:text-white transition-colors" />
                </div>
                <div>
                  <h3 className="font-bold mb-1">{title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

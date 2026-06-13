"use client"
import { useQuery } from "@tanstack/react-query"
import { listProductsQueryOptions } from "@/lib/api"
import { ProductCard } from "./ProductCard"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Sparkles } from "lucide-react"

export function NewArrivals() {
  const { data: products, isLoading } = useQuery(listProductsQueryOptions)
  // newest 4 by created_at
  const newest = [...(products ?? [])]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 4)

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="flex items-end justify-between mb-10">
        <div>
          <span className="inline-flex items-center gap-1.5 text-amber-500 text-xs font-bold uppercase tracking-[0.15em] mb-3">
            <Sparkles className="h-3.5 w-3.5" /> Just Dropped
          </span>
          <h2 className="text-3xl md:text-4xl font-black uppercase leading-none">New Arrivals</h2>
        </div>
        <Button asChild variant="outline" className="hidden sm:flex rounded-full px-6 gap-2 border-2 hover:border-amber-500 hover:text-amber-500 transition-colors">
          <Link href="/store?sort=new">See All</Link>
        </Button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="aspect-[3/4] w-full rounded-2xl" />
              <Skeleton className="h-4 w-3/4 rounded-lg" />
              <Skeleton className="h-4 w-1/2 rounded-lg" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {newest.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      )}

      <div className="flex justify-center mt-8 sm:hidden">
        <Button asChild variant="outline" className="rounded-full px-8 border-2">
          <Link href="/store?sort=new">See All New Arrivals</Link>
        </Button>
      </div>
    </section>
  )
}

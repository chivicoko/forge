"use client"
import { useQuery } from "@tanstack/react-query"
import { listProductsQueryOptions, getRateByIdQueryOptions, listRatesQueryOptions } from "@/lib/api"
import { ProductCard } from "./ProductCard"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight, Loader2 } from "lucide-react"
import { useUserPrefs } from "@/stores/useUserPrefs"
import { Skeleton } from "@/components/ui/skeleton"

export function FeaturedSection() {
  const { data: products, isLoading } = useQuery(listProductsQueryOptions)
  const featured = products?.slice(0, 4)

  return (
    <section id="featured" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="flex items-end justify-between mb-10">
        <div>
          <p className="text-amber-500 text-sm font-semibold uppercase tracking-widest mb-2">Handpicked for you</p>
          <h2 className="text-3xl md:text-4xl font-black uppercase">Featured Items</h2>
        </div>
        <Button asChild variant="outline" className="gap-2 hidden sm:flex">
          <Link href="/featured">View All <ArrowRight className="h-4 w-4" /></Link>
        </Button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="aspect-[3/4] w-full rounded-xl" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {featured?.map((product) => <ProductCard key={product.id} product={product} />)}
        </div>
      )}

      <div className="flex justify-center mt-8 sm:hidden">
        <Button asChild variant="outline" className="gap-2">
          <Link href="/featured">View All <ArrowRight className="h-4 w-4" /></Link>
        </Button>
      </div>
    </section>
  )
}

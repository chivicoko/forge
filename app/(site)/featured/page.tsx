"use client"
import { useQuery }     from "@tanstack/react-query"
import { listProductsQueryOptions, listCategoriesQueryOptions } from "@/lib/api"
import { ProductCard }  from "@/components/home/ProductCard"
import { Skeleton }     from "@/components/ui/skeleton"
import { useState, useMemo, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import type { Metadata } from "next"

function FeaturedContent() {
  const searchParams = useSearchParams()
  const initCat      = searchParams.get("category")

  const { data: products,   isLoading }    = useQuery(listProductsQueryOptions)
  const { data: categories }               = useQuery(listCategoriesQueryOptions)
  const [selectedCat, setSelectedCat]      = useState<string | null>(initCat)

  const featured = useMemo(() => {
    if (!products) return []
    const base = products.filter(p => p.sold > 0 || p.is_listed)
    return selectedCat ? base.filter(p => p.category_id === selectedCat) : base
  }, [products, selectedCat])

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Category filter */}
      {categories && categories.length > 0 && (
        <div className="flex gap-2 flex-wrap mb-7">
          <button
            onClick={() => setSelectedCat(null)}
            className={`px-5 py-2 rounded-full text-sm font-bold border-2 transition-all ${!selectedCat ? "bg-amber-500 text-white border-amber-500" : "border-border hover:border-amber-500 hover:text-amber-500"}`}
          >All</button>
          {categories.map(c => (
            <button key={c.id}
              onClick={() => setSelectedCat(selectedCat === c.id ? null : c.id)}
              className={`px-5 py-2 rounded-full text-sm font-bold border-2 transition-all ${selectedCat === c.id ? "bg-amber-500 text-white border-amber-500" : "border-border hover:border-amber-500 hover:text-amber-500"}`}
            >{c.name}</button>
          ))}
        </div>
      )}

      <p className="text-sm text-muted-foreground mb-5 font-medium">{featured.length} item{featured.length !== 1 ? "s" : ""}</p>

      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className="aspect-[3/4] rounded-2xl" />)}
        </div>
      ) : featured.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
          {featured.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      ) : (
        <div className="text-center py-20 text-muted-foreground">
          <p className="text-4xl mb-3">📦</p>
          <p className="font-semibold">Nothing here yet</p>
        </div>
      )}
    </div>
  )
}

export default function FeaturedPage() {
  return (
    <div className="min-h-screen page-enter">
      <div className="bg-foreground text-background py-14 px-4">
        <div className="max-w-7xl mx-auto">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-500 mb-2">FORGE</p>
          <h1 className="text-5xl md:text-6xl font-black uppercase leading-none">Featured</h1>
          <p className="text-sm mt-3 opacity-50">Our handpicked selection.</p>
        </div>
      </div>
      <Suspense fallback={<div className="p-8" />}>
        <FeaturedContent />
      </Suspense>
    </div>
  )
}

"use client"
import { useQuery }    from "@tanstack/react-query"
import { listProductsQueryOptions, listCategoriesQueryOptions } from "@/lib/api"
import { ProductCard } from "@/components/home/ProductCard"
import { Skeleton }    from "@/components/ui/skeleton"
import { Button }      from "@/components/ui/button"
import { Input }       from "@/components/ui/input"
import { Badge }       from "@/components/ui/badge"
import { useMemo, useState, useEffect, Suspense } from "react"
import { Search, SlidersHorizontal, X, ChevronDown } from "lucide-react"
import { useSearchParams, useRouter, usePathname } from "next/navigation"
import type { Metadata } from "next"

type SortKey = "newest" | "price-asc" | "price-desc" | "popular"

function StoreContent() {
  const searchParams  = useSearchParams()
  const router        = useRouter()
  const pathname      = usePathname()

  const [search,           setSearch]           = useState(searchParams.get("q") ?? "")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(searchParams.get("category"))
  const [sortBy,           setSortBy]           = useState<SortKey>((searchParams.get("sort") as SortKey) ?? "newest")
  const [inStockOnly,      setInStockOnly]      = useState(false)
  const [filtersOpen,      setFiltersOpen]      = useState(false)

  const { data: products,   isLoading: prodLoading }  = useQuery(listProductsQueryOptions)
  const { data: categories, isLoading: catLoading }   = useQuery(listCategoriesQueryOptions)

  // Sync URL params
  useEffect(() => {
    const p = new URLSearchParams()
    if (search)           p.set("q",        search)
    if (selectedCategory) p.set("category", selectedCategory)
    if (sortBy !== "newest") p.set("sort", sortBy)
    const qs = p.toString()
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false })
  }, [search, selectedCategory, sortBy, pathname, router])

  const filtered = useMemo(() => {
    if (!products) return []
    let r = [...products]
    if (search)           r = r.filter(p => `${p.name} ${p.description}`.toLowerCase().includes(search.toLowerCase()))
    if (selectedCategory) r = r.filter(p => p.category_id === selectedCategory)
    if (inStockOnly)      r = r.filter(p => p.stock > 0)
    const sorters: Record<SortKey, (a: typeof r[0], b: typeof r[0]) => number> = {
      "newest":     (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
      "price-asc":  (a, b) => a.price - b.price,
      "price-desc": (a, b) => b.price - a.price,
      "popular":    (a, b) => b.sold - a.sold,
    }
    return r.sort(sorters[sortBy])
  }, [products, search, selectedCategory, sortBy, inStockOnly])

  const activeFilters = [
    search           && { label: `"${search}"`,                            clear: () => setSearch("") },
    selectedCategory && { label: categories?.find(c => c.id === selectedCategory)?.name ?? "Category", clear: () => setSelectedCategory(null) },
    inStockOnly      && { label: "In Stock",                               clear: () => setInStockOnly(false) },
  ].filter(Boolean) as { label: string; clear: () => void }[]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3 mb-5">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <Input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search products…"
            className="pl-9 pr-8 h-10 rounded-xl"
            aria-label="Search products"
          />
          {search && (
            <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground" aria-label="Clear search">
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Sort */}
        <div className="relative">
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value as SortKey)}
            aria-label="Sort products"
            className="h-10 pl-3 pr-8 rounded-xl border border-input bg-background text-sm font-medium appearance-none cursor-pointer focus-visible:ring-2 focus-visible:ring-ring"
          >
            <option value="newest">Newest</option>
            <option value="popular">Most Popular</option>
            <option value="price-asc">Price: Low → High</option>
            <option value="price-desc">Price: High → Low</option>
          </select>
          <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        </div>

        {/* In-stock toggle */}
        <Button
          variant={inStockOnly ? "default" : "outline"}
          size="sm"
          onClick={() => setInStockOnly(!inStockOnly)}
          className={`h-10 rounded-xl ${inStockOnly ? "bg-amber-500 hover:bg-amber-600 text-white border-0" : ""}`}
          aria-pressed={inStockOnly}
        >
          In Stock
        </Button>

        {/* Results */}
        <span className="ml-auto text-sm text-muted-foreground font-medium">
          {filtered.length} result{filtered.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Category pills */}
      {categories && categories.length > 0 && (
        <div className="flex gap-2 flex-wrap mb-5" role="list" aria-label="Category filters">
          <button
            role="listitem"
            onClick={() => setSelectedCategory(null)}
            className={`px-4 py-1.5 rounded-full text-sm font-semibold border-2 transition-all duration-200 ${!selectedCategory ? "bg-amber-500 text-white border-amber-500" : "border-border hover:border-amber-500 hover:text-amber-500"}`}
          >
            All
          </button>
          {categories.map(cat => (
            <button
              key={cat.id}
              role="listitem"
              onClick={() => setSelectedCategory(selectedCategory === cat.id ? null : cat.id)}
              className={`px-4 py-1.5 rounded-full text-sm font-semibold border-2 transition-all duration-200 ${selectedCategory === cat.id ? "bg-amber-500 text-white border-amber-500" : "border-border hover:border-amber-500 hover:text-amber-500"}`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      )}

      {/* Active filter chips */}
      {activeFilters.length > 0 && (
        <div className="flex gap-2 flex-wrap mb-4">
          {activeFilters.map(({ label, clear }) => (
            <span key={label} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-400 text-xs font-semibold border border-amber-500/30">
              {label}
              <button onClick={clear} aria-label={`Remove filter: ${label}`}><X className="h-3 w-3" /></button>
            </span>
          ))}
          <button
            onClick={() => { setSearch(""); setSelectedCategory(null); setInStockOnly(false) }}
            className="text-xs text-muted-foreground hover:text-destructive underline underline-offset-2 transition-colors"
          >
            Clear all
          </button>
        </div>
      )}

      {/* Grid */}
      {prodLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="aspect-[3/4] w-full rounded-2xl" />
              <Skeleton className="h-4 w-3/4 rounded-lg" />
              <Skeleton className="h-4 w-1/2 rounded-lg" />
              <Skeleton className="h-8 w-full rounded-xl" />
            </div>
          ))}
        </div>
      ) : filtered.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
          {filtered.map(product => <ProductCard key={product.id} product={product} />)}
        </div>
      ) : (
        <div className="text-center py-24 text-muted-foreground">
          <p className="text-5xl mb-4">🔍</p>
          <p className="text-xl font-bold mb-2">No products found</p>
          <p className="text-sm">Try adjusting your search or filters.</p>
          <Button
            variant="outline"
            className="mt-5 rounded-full"
            onClick={() => { setSearch(""); setSelectedCategory(null); setInStockOnly(false) }}
          >
            Clear all filters
          </Button>
        </div>
      )}
    </div>
  )
}

export default function StorePage() {
  return (
    <div className="min-h-screen page-enter">
      {/* Page header */}
      <div className="bg-foreground text-background py-14 px-4">
        <div className="max-w-7xl mx-auto">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-500 mb-2">FORGE</p>
          <h1 className="text-5xl md:text-6xl font-black uppercase leading-none">The Store</h1>
          <p className="text-sm mt-3 opacity-50">Every piece, one place.</p>
        </div>
      </div>
      <Suspense fallback={
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className="aspect-[3/4] rounded-2xl" />)}
          </div>
        </div>
      }>
        <StoreContent />
      </Suspense>
    </div>
  )
}

"use client"
import { useQuery } from "@tanstack/react-query"
import { listCategoriesQueryOptions, listProductsByCategoryQueryOptions } from "@/lib/api"
import Link from "next/link"
import { Tag } from "lucide-react"

export function CategoriesStrip() {
  const { data: categories } = useQuery(listCategoriesQueryOptions)
  if (!categories || categories.length === 0) return null

  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground mb-5">Browse by Category</p>
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/store?category=${cat.id}`}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full border-2 border-border hover:border-amber-500 hover:text-amber-500 bg-background transition-all duration-200 whitespace-nowrap shrink-0 font-semibold text-sm"
            >
              <Tag className="h-3.5 w-3.5" />
              {cat.name}
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

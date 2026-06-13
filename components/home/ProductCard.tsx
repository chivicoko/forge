"use client"
import Link from "next/link"
import Image from "next/image"
import { SquarePlus, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useCart } from "@/stores/useCartStore"
import { useUserPrefs } from "@/stores/useUserPrefs"
import { useQuery } from "@tanstack/react-query"
import { getRateByIdQueryOptions, listRatesQueryOptions } from "@/lib/api"
import { getCurrencySymbol } from "@/lib/utils"
import { toast } from "sonner"
import type { ProductType } from "@/types"
import { useState } from "react"

const COLOR_MAP: Record<string, string> = {
  WHITE: "bg-white border", BLACK: "bg-black", "NAVY BLUE": "bg-blue-800",
  BEIGE: "bg-[#F5F0E8]", GREY: "bg-gray-500", "OLIVE GREEN": "bg-green-700",
  BURGUNDY: "bg-rose-800", BROWN: "bg-orange-900", CREAM: "bg-yellow-50 border",
}

export function ProductCard({ product }: { product: ProductType }) {
  const [hovered, setHovered] = useState(false)
  const { setCart, increaseQuantity, isInCart, updateCartItemProperty, cart } = useCart()
  const { rateId } = useUserPrefs()
  const { data: rates } = useQuery(listRatesQueryOptions)
  const { data: rateDetails } = useQuery(getRateByIdQueryOptions(rateId || rates?.[0]?.id || ""))

  const rate = rateDetails?.naira_rate ?? 1
  const symbol = getCurrencySymbol(rateDetails?.currency ?? "NGN")
  const existingItem = cart.find((i) => i.id === product.id)
  const selectedSizes = Array.isArray(existingItem?.sizes) ? existingItem.sizes : []

  const handleAddToCart = () => {
    if (!isInCart(product.id)) {
      setCart({ ...product, quantity: 1, colors: [], sizes: [] })
      toast.success(`${product.name} added to cart`)
    } else {
      increaseQuantity(product.id)
      toast.success(`${product.name} quantity increased`)
    }
  }

  return (
    <div
      className="group relative bg-background rounded-xl overflow-hidden border hover:border-amber-500/50 hover:shadow-lg transition-all duration-300"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Image */}
      <div className="relative aspect-[3/4] overflow-hidden bg-muted">
        <Link href={`/store/${product.id}`} aria-label={`View ${product.name}`}>
          {product.images?.[0] ? (
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
              <span className="text-4xl">👕</span>
            </div>
          )}
        </Link>
        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {product.stock < 10 && product.stock > 0 && (
            <Badge variant="warning">Low Stock</Badge>
          )}
          {product.stock === 0 && <Badge variant="destructive">Sold Out</Badge>}
          {product.sold > 50 && <Badge className="bg-amber-500 text-white border-0">Best Seller</Badge>}
        </div>
        {/* Quick view overlay */}
        <div className={`absolute inset-0 bg-black/20 flex items-center justify-center transition-opacity duration-300 ${hovered ? "opacity-100" : "opacity-0"}`}>
          <Button asChild variant="secondary" size="sm" className="gap-1">
            <Link href={`/store/${product.id}`}><Eye className="h-4 w-4" />Quick View</Link>
          </Button>
        </div>
      </div>

      {/* Info */}
      <div className="p-3">
        <div className="flex items-start justify-between gap-2 mb-2">
          <Link href={`/store/${product.id}`} className="font-semibold text-sm line-clamp-1 hover:text-amber-500 transition-colors">
            {product.name}
          </Link>
          <span className="text-amber-500 font-bold text-sm whitespace-nowrap">
            {symbol}{(product.price / rate).toFixed(2)}
          </span>
        </div>

        {/* Sizes */}
        {product.sizes?.length > 0 && (
          <div className="flex gap-1 flex-wrap mb-2">
            {product.sizes.slice(0, 4).map((s) => (
              <button key={s}
                onClick={() => existingItem && updateCartItemProperty(product.id, "sizes", s)}
                className={`text-xs px-1.5 py-0.5 rounded border transition-colors ${selectedSizes.includes(s) ? "bg-amber-500 text-white border-amber-500" : "border-border hover:border-amber-500"}`}>
                {s}
              </button>
            ))}
          </div>
        )}

        {/* Colors */}
        {product.colors?.length > 0 && (
          <div className="flex gap-1 mb-3">
            {product.colors.slice(0, 5).map((c) => (
              <div key={c} title={c}
                className={`w-4 h-4 rounded-full cursor-default ${COLOR_MAP[c] ?? "bg-gray-400"}`} />
            ))}
          </div>
        )}

        <Button
          onClick={handleAddToCart}
          disabled={product.stock === 0}
          className="w-full h-8 text-xs gap-1 bg-foreground text-background hover:bg-amber-500 hover:text-white transition-colors"
        >
          <SquarePlus className="h-3.5 w-3.5" />
          {isInCart(product.id) ? "Add More" : "Add to Cart"}
        </Button>
      </div>
    </div>
  )
}

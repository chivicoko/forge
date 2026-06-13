"use client"
import { use }           from "react"
import { useQuery }      from "@tanstack/react-query"
import { getProductByIdQueryOptions, getRateByIdQueryOptions, listRatesQueryOptions, listProductsQueryOptions } from "@/lib/api"
import { useCart }       from "@/stores/useCartStore"
import { useUserPrefs }  from "@/stores/useUserPrefs"
import { getCurrencySymbol } from "@/lib/utils"
import { toast }         from "sonner"
import { useState }      from "react"
import { Button }        from "@/components/ui/button"
import { Badge }         from "@/components/ui/badge"
import { Skeleton }      from "@/components/ui/skeleton"
import { ProductCard }   from "@/components/home/ProductCard"
import Image             from "next/image"
import Link              from "next/link"
import { ShoppingBag, Heart, Share2, ChevronRight, Check } from "lucide-react"

const COLOR_BG: Record<string, string> = {
  WHITE: "bg-white border-2 border-gray-200", BLACK: "bg-black",
  "NAVY BLUE": "bg-blue-800", BEIGE: "bg-[#F5F0E8] border border-gray-300",
  GREY: "bg-gray-500", "OLIVE GREEN": "bg-green-700",
  BURGUNDY: "bg-rose-800", BROWN: "bg-orange-900",
  CREAM: "bg-yellow-50 border border-gray-200",
}

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)

  const { data: product, isLoading, isError } = useQuery(getProductByIdQueryOptions(id))
  const { data: allProducts } = useQuery(listProductsQueryOptions)
  const { rateId } = useUserPrefs()
  const { data: rates }       = useQuery(listRatesQueryOptions)
  const effectiveRateId       = rateId || rates?.[0]?.id || ""
  const { data: rateDetails } = useQuery(getRateByIdQueryOptions(effectiveRateId))
  const { setCart, increaseQuantity, isInCart, updateCartItemProperty, cart } = useCart()

  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity,      setQuantity]      = useState(1)

  const rate   = rateDetails?.naira_rate ?? 1
  const symbol = getCurrencySymbol(rateDetails?.currency ?? "NGN")
  const item   = cart.find(i => i.id === product?.id)
  const selSizes  = Array.isArray(item?.sizes)  ? (item.sizes  as string[]) : []
  const selColors = Array.isArray(item?.colors) ? (item.colors as string[]) : []

  const related = allProducts
    ?.filter(p => p.id !== product?.id && p.category_id === product?.category_id)
    .slice(0, 4)

  const handleAddToCart = () => {
    if (!product) return
    if (!isInCart(product.id)) {
      setCart({ ...product, quantity, colors: [], sizes: [] })
      toast.success(`${product.name} added to cart!`)
    } else {
      for (let i = 0; i < quantity; i++) increaseQuantity(product.id)
      toast.success("Quantity updated!")
    }
  }

  const handleShare = async () => {
    try {
      if (navigator.share) await navigator.share({ title: product?.name, url: window.location.href })
      else { await navigator.clipboard.writeText(window.location.href); toast.success("Link copied!") }
    } catch { /* dismissed */ }
  }

  if (isLoading) return (
    <div className="max-w-6xl mx-auto px-4 py-8 grid md:grid-cols-2 gap-10">
      <div className="space-y-3">
        <Skeleton className="aspect-square w-full rounded-2xl" />
        <div className="grid grid-cols-5 gap-2">
          {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="aspect-square rounded-xl" />)}
        </div>
      </div>
      <div className="space-y-4 pt-4">
        <Skeleton className="h-9 w-3/4 rounded-lg" />
        <Skeleton className="h-7 w-1/4 rounded-lg" />
        <Skeleton className="h-24 w-full rounded-xl" />
        <Skeleton className="h-11 w-full rounded-xl" />
      </div>
    </div>
  )

  if (isError || !product) return (
    <div className="text-center py-28 px-4">
      <p className="text-6xl mb-4">😕</p>
      <p className="text-xl font-bold mb-2">Product not found</p>
      <Button asChild variant="outline" className="mt-4 rounded-full"><Link href="/store">Back to Store</Link></Button>
    </div>
  )

  const images = product.images?.filter(Boolean) ?? []

  return (
    <div className="page-enter">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-muted-foreground mb-8 font-medium">
          <Link href="/"      className="hover:text-foreground transition-colors">Home</Link>
          <ChevronRight className="h-3 w-3 opacity-50" />
          <Link href="/store" className="hover:text-foreground transition-colors">Store</Link>
          <ChevronRight className="h-3 w-3 opacity-50" />
          <span className="text-foreground truncate max-w-[180px]">{product.name}</span>
        </nav>

        <div className="grid md:grid-cols-2 gap-10 lg:gap-16">
          {/* Images */}
          <div className="space-y-3">
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-muted ring-1 ring-border">
              {images.length > 0
                ? <Image src={images[selectedImage]} alt={product.name} fill className="object-cover" priority sizes="(max-width: 768px) 100vw, 50vw" />
                : <div className="w-full h-full flex items-center justify-center text-7xl">👕</div>
              }
            </div>
            {images.length > 1 && (
              <div className="grid grid-cols-5 gap-2">
                {images.map((src, i) => (
                  <button key={i} onClick={() => setSelectedImage(i)} aria-label={`Image ${i + 1}`}
                    className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all ${selectedImage === i ? "border-amber-500 scale-[1.03]" : "border-transparent hover:border-amber-500/50"}`}>
                    <Image src={src} alt="" fill className="object-cover" sizes="80px" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="pt-2">
            <div className="flex items-start justify-between gap-3 mb-3">
              <h1 className="text-3xl md:text-4xl font-black leading-tight">{product.name}</h1>
              <button onClick={handleShare} aria-label="Share" className="p-2.5 rounded-xl border hover:border-amber-500 hover:text-amber-500 transition-all shrink-0">
                <Share2 className="h-4 w-4" />
              </button>
            </div>

            <div className="flex items-center gap-3 mb-5 flex-wrap">
              <span className="text-3xl font-black text-amber-500">{symbol}{(product.price / rate).toFixed(2)}</span>
              <Badge variant={product.stock > 0 ? "success" : "destructive"}>
                {product.stock > 0 ? `${product.stock} in stock` : "Sold out"}
              </Badge>
              {product.sold > 0 && <span className="text-xs text-muted-foreground">{product.sold.toLocaleString()} sold</span>}
            </div>

            <p className="text-muted-foreground leading-relaxed mb-7 text-sm">{product.description}</p>

            {/* Sizes */}
            {product.sizes?.length > 0 && (
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-bold uppercase tracking-wide">Size</h3>
                  {selSizes.length > 0 && <span className="text-xs text-amber-500 font-semibold">{selSizes.join(", ")}</span>}
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map(s => (
                    <button key={s} aria-pressed={selSizes.includes(s)}
                      onClick={() => item ? updateCartItemProperty(product.id, "sizes", s) : toast.info("Add to cart first to select size")}
                      className={`px-4 py-2 rounded-xl border-2 text-sm font-bold transition-all ${selSizes.includes(s) ? "bg-amber-500 text-white border-amber-500" : "hover:border-amber-500 hover:text-amber-500"}`}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Colors */}
            {product.colors?.length > 0 && (
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-bold uppercase tracking-wide">Color</h3>
                  {selColors.length > 0 && <span className="text-xs text-amber-500 font-semibold">{selColors.join(", ")}</span>}
                </div>
                <div className="flex flex-wrap gap-2.5">
                  {product.colors.map(c => (
                    <button key={c} title={c} aria-label={`Color: ${c}`} aria-pressed={selColors.includes(c)}
                      onClick={() => item ? updateCartItemProperty(product.id, "colors", c) : toast.info("Add to cart first")}
                      className={`relative w-9 h-9 rounded-full transition-all ${COLOR_BG[c] ?? "bg-gray-400"} ${selColors.includes(c) ? "ring-2 ring-offset-2 ring-amber-500 scale-110" : "hover:scale-105"}`}>
                      {selColors.includes(c) && <Check className="absolute inset-0 m-auto h-4 w-4 text-white drop-shadow" />}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="flex items-center gap-4 mb-6">
              <span className="text-sm font-bold uppercase tracking-wide">Qty</span>
              <div className="flex items-center border-2 rounded-xl overflow-hidden">
                <button onClick={() => setQuantity(q => Math.max(1, q - 1))} aria-label="Decrease" className="px-4 py-2.5 text-lg font-bold hover:bg-muted transition-colors">−</button>
                <span className="px-4 py-2.5 font-bold text-sm min-w-[40px] text-center">{quantity}</span>
                <button onClick={() => setQuantity(q => Math.min(product.stock, q + 1))} aria-label="Increase" className="px-4 py-2.5 text-lg font-bold hover:bg-muted transition-colors">+</button>
              </div>
            </div>

            <div className="flex gap-3 mb-6">
              <Button onClick={handleAddToCart} disabled={product.stock === 0}
                className="flex-1 h-12 bg-amber-500 hover:bg-amber-600 text-white font-bold gap-2 rounded-xl text-base">
                <ShoppingBag className="h-5 w-5" />
                {isInCart(product.id) ? "Add More" : "Add to Cart"}
              </Button>
              <Button variant="outline" size="icon" className="h-12 w-12 rounded-xl border-2" aria-label="Wishlist">
                <Heart className="h-5 w-5" />
              </Button>
            </div>

            <div className="rounded-xl bg-muted/50 p-4 text-xs space-y-1.5 text-muted-foreground">
              {["✓  Free shipping on orders over $150","✓  Easy 30-day returns & exchanges","✓  Secure SSL checkout via Stripe","✓  Quality guaranteed"].map(t => <p key={t}>{t}</p>)}
            </div>
          </div>
        </div>

        {related && related.length > 0 && (
          <div className="mt-20">
            <h2 className="text-2xl font-black uppercase mb-6">You may also like</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {related.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

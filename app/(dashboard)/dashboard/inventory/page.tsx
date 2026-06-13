"use client"
export const dynamic = "force-dynamic"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { listProductsQueryOptions, deleteProduct } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Plus, Trash2, Edit, ImageOff, Search } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { toast } from "sonner"
import { Input } from "@/components/ui/input"
import { useState } from "react"

export default function InventoryPage() {
  const qc = useQueryClient()
  const { data: products, isLoading } = useQuery(listProductsQueryOptions)
  const [search, setSearch] = useState("")

  const deleteMut = useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["products"] }); toast.success("Product deleted") },
    onError: () => toast.error("Failed to delete"),
  })

  const filtered = products?.filter(p => p.name.toLowerCase().includes(search.toLowerCase())) ?? []

  return (
    <div className="space-y-5 max-w-7xl">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-black">Inventory</h1>
          <p className="text-sm text-muted-foreground">{products?.length ?? 0} products total</p>
        </div>
        <Button asChild className="bg-amber-500 hover:bg-amber-600 text-white gap-2">
          <Link href="/dashboard/inventory/add-product"><Plus className="h-4 w-4" />Add Product</Link>
        </Button>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search products…" className="pl-9" />
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className="h-64 rounded-2xl" />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((product) => (
            <div key={product.id} className="bg-background border rounded-2xl overflow-hidden hover:border-amber-500/50 transition-colors group">
              <div className="relative aspect-square bg-muted">
                {product.images?.[0]
                  ? <Image src={product.images[0]} alt={product.name} fill className="object-cover" sizes="(max-width: 768px) 50vw, 25vw" />
                  : <div className="w-full h-full flex items-center justify-center text-muted-foreground"><ImageOff className="h-8 w-8 opacity-30" /></div>}
                <div className="absolute top-2 right-2 flex flex-col gap-1">
                  <Badge variant={product.is_listed ? "success" : "secondary"} className="text-xs">
                    {product.is_listed ? "Listed" : "Hidden"}
                  </Badge>
                  {product.stock < 5 && <Badge variant="warning" className="text-xs">{product.stock} left</Badge>}
                </div>
              </div>
              <div className="p-3">
                <p className="font-semibold text-sm line-clamp-1 mb-1">{product.name}</p>
                <p className="text-amber-500 font-bold text-sm">₦{product.price.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{product.sold} sold · {product.stock} in stock</p>
                <div className="flex gap-2 mt-3">
                  <Button asChild variant="outline" size="sm" className="flex-1 gap-1 h-8 text-xs">
                    <Link href={`/dashboard/inventory/${product.id}`}><Edit className="h-3 w-3" />Edit</Link>
                  </Button>
                  <Button variant="outline" size="sm" className="h-8 w-8 p-0 text-destructive border-destructive/40 hover:border-destructive"
                    onClick={() => { if (confirm("Delete this product?")) deleteMut.mutate(product.id) }}
                    disabled={deleteMut.isPending}>
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      {!isLoading && filtered.length === 0 && (
        <div className="text-center py-16 text-muted-foreground">
          <p className="text-4xl mb-3">📦</p>
          <p className="font-semibold">{search ? "No products match that search" : "No products yet"}</p>
          {!search && <Button asChild className="mt-4 bg-amber-500 hover:bg-amber-600 text-white"><Link href="/dashboard/inventory/add-product">Add your first product</Link></Button>}
        </div>
      )}
    </div>
  )
}

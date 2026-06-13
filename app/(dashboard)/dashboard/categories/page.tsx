"use client"
export const dynamic = "force-dynamic"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { listCategoriesQueryOptions, addCategory, deleteCategory } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { Plus, Trash2, Tag, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"

const schema = z.object({ name: z.string().min(1, "Category name required") })

export default function CategoriesPage() {
  const qc = useQueryClient()
  const { data: categories, isLoading } = useQuery(listCategoriesQueryOptions)

  const addMut = useMutation({
    mutationFn: addCategory,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["categories"] }); reset(); toast.success("Category added") },
    onError: () => toast.error("Failed to add category"),
  })

  const deleteMut = useMutation({
    mutationFn: deleteCategory,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["categories"] }); toast.success("Category deleted") },
    onError: () => toast.error("Failed to delete"),
  })

  const { register, handleSubmit, reset, formState: { errors } } = useForm({ resolver: zodResolver(schema) })
  const onSubmit = (values: any) => addMut.mutate({ name: values.name, is_listed: true })

  return (
    <div className="max-w-2xl space-y-6">
      <div><h1 className="text-2xl font-black">Categories</h1><p className="text-sm text-muted-foreground">{categories?.length ?? 0} categories</p></div>

      {/* Add form */}
      <div className="bg-background border rounded-2xl p-5">
        <h2 className="font-bold mb-4">Add New Category</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="flex gap-2">
          <div className="flex-1">
            <Input {...register("name")} placeholder="e.g. Track Suits, Innerwear…" className="h-10" />
            {errors.name && <p className="text-xs text-destructive mt-1">{(errors.name as any).message}</p>}
          </div>
          <Button type="submit" disabled={addMut.isPending} className="bg-amber-500 hover:bg-amber-600 text-white gap-2 shrink-0">
            {addMut.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
            Add
          </Button>
        </form>
      </div>

      {/* List */}
      <div className="bg-background border rounded-2xl overflow-hidden">
        {isLoading ? (
          <div className="p-4 space-y-2">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-12 rounded-xl" />)}</div>
        ) : categories && categories.length > 0 ? (
          <ul className="divide-y">
            {categories.map((cat) => (
              <li key={cat.id} className="flex items-center justify-between px-5 py-3 hover:bg-muted/30 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center">
                    <Tag className="h-4 w-4 text-amber-500" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{cat.name}</p>
                    <p className="text-xs text-muted-foreground">ID: {cat.id?.slice(0, 8)}…</p>
                  </div>
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive"
                  onClick={() => { if (confirm(`Delete "${cat.name}"?`)) deleteMut.mutate(cat.id) }}
                  disabled={deleteMut.isPending}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center py-12 text-muted-foreground">No categories yet.</p>
        )}
      </div>
    </div>
  )
}

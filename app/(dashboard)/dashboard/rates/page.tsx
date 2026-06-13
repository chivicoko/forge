"use client"
export const dynamic = "force-dynamic"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { listRatesQueryOptions, addRate, deleteRate } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { Plus, Trash2, Loader2, DollarSign } from "lucide-react"
import { toast } from "sonner"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"

const schema = z.object({
  country: z.string().min(1, "Country required"),
  currency: z.string().min(2, "Currency code required (e.g. USD)"),
  naira_rate: z.coerce.number().positive("Rate must be positive"),
})

export default function RatesPage() {
  const qc = useQueryClient()
  const { data: rates, isLoading } = useQuery(listRatesQueryOptions)

  const addMut = useMutation({
    mutationFn: addRate,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["rates"] }); reset(); toast.success("Rate added") },
    onError: () => toast.error("Failed to add rate"),
  })
  const deleteMut = useMutation({
    mutationFn: deleteRate,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["rates"] }); toast.success("Rate deleted") },
    onError: () => toast.error("Failed to delete"),
  })

  const { register, handleSubmit, reset, formState: { errors } } = useForm({ resolver: zodResolver(schema) })
  const onSubmit = (values: any) => addMut.mutate(values)

  return (
    <div className="max-w-2xl space-y-6">
      <div><h1 className="text-2xl font-black">Exchange Rates</h1><p className="text-sm text-muted-foreground">Manage currency conversion rates (base: NGN)</p></div>

      <div className="bg-background border rounded-2xl p-5">
        <h2 className="font-bold mb-4">Add Rate</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="grid sm:grid-cols-3 gap-3">
          <div>
            <Input {...register("country")} placeholder="Country (e.g. USA)" />
            {errors.country && <p className="text-xs text-destructive mt-1">{(errors.country as any).message}</p>}
          </div>
          <div>
            <Input {...register("currency")} placeholder="Code (e.g. USD)" className="uppercase" />
            {errors.currency && <p className="text-xs text-destructive mt-1">{(errors.currency as any).message}</p>}
          </div>
          <div>
            <Input {...register("naira_rate")} type="number" step="0.01" placeholder="NGN rate (e.g. 1600)" />
            {errors.naira_rate && <p className="text-xs text-destructive mt-1">{(errors.naira_rate as any).message}</p>}
          </div>
          <div className="sm:col-span-3">
            <Button type="submit" disabled={addMut.isPending} className="bg-amber-500 hover:bg-amber-600 text-white gap-2">
              {addMut.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />} Add Rate
            </Button>
          </div>
        </form>
      </div>

      <div className="bg-background border rounded-2xl overflow-hidden">
        {isLoading ? (
          <div className="p-4 space-y-2">{Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-14 rounded-xl" />)}</div>
        ) : rates && rates.length > 0 ? (
          <ul className="divide-y">
            {rates.map((rate) => (
              <li key={rate.id} className="flex items-center justify-between px-5 py-3 hover:bg-muted/30">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-amber-500/10 flex items-center justify-center">
                    <DollarSign className="h-4 w-4 text-amber-500" />
                  </div>
                  <div>
                    <p className="font-bold text-sm">{rate.currency} — {rate.country}</p>
                    <p className="text-xs text-muted-foreground">1 {rate.currency} = ₦{rate.naira_rate.toLocaleString()}</p>
                  </div>
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive"
                  onClick={() => { if (rate.id && confirm(`Delete ${rate.currency}?`)) deleteMut.mutate(rate.id) }}
                  disabled={deleteMut.isPending}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </li>
            ))}
          </ul>
        ) : <p className="text-center py-12 text-muted-foreground">No rates configured.</p>}
      </div>
    </div>
  )
}

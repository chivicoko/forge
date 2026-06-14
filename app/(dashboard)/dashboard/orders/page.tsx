"use client";
export const dynamic = "force-dynamic";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { listAllOrdersQueryOptions } from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { format } from "date-fns";
import { Search, Eye } from "lucide-react";
import { useState } from "react";
import type { OrderType } from "@/types";

const STATUS_OPTIONS = [
  "pending",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
  "paid",
];
const statusVariant: Record<string, any> = {
  paid: "success",
  delivered: "success",
  processing: "warning",
  pending: "warning",
  shipped: "default",
  cancelled: "destructive",
};

export default function OrdersPage() {
  const qc = useQueryClient();
  const { data: orders, isLoading } = useQuery(listAllOrdersQueryOptions);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<OrderType | null>(null);

  const updateMut = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const res = await fetch(`/api/orders/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error("Update failed");
      return res.json();
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["orders"] }),
  });

  const filtered =
    orders?.filter(
      (o) =>
        o.reference?.toLowerCase().includes(search.toLowerCase()) ||
        o.address?.toLowerCase().includes(search.toLowerCase()),
    ) ?? [];

  return (
    <div className="space-y-5 max-w-7xl">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-black">Orders</h1>
          <p className="text-sm text-muted-foreground">
            {orders?.length ?? 0} total
          </p>
        </div>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by reference or address…"
          className="pl-9"
        />
      </div>

      {isLoading ? (
        <div className="space-y-2">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-14 rounded-xl" />
          ))}
        </div>
      ) : (
        <div className="bg-background border rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b bg-muted/40">
                <tr>
                  {["Reference", "Date", "Address", "Total", "Status", ""].map(
                    (h) => (
                      <th
                        key={h}
                        className="text-left py-3 px-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground first:pl-5 last:pr-5 last:text-right"
                      >
                        {h}
                      </th>
                    ),
                  )}
                </tr>
              </thead>
              <tbody className="divide-y">
                {filtered.map((order) => (
                  <tr
                    key={order.id}
                    className="hover:bg-muted/30 transition-colors"
                  >
                    <td className="py-3 px-4 pl-5 font-mono text-xs">
                      {order.reference?.slice(0, 14)}…
                    </td>
                    <td className="py-3 px-4 text-muted-foreground whitespace-nowrap">
                      {order.created_at
                        ? format(new Date(order.created_at), "MMM d, yyyy")
                        : "—"}
                    </td>
                    <td className="py-3 px-4 max-w-45 truncate text-muted-foreground">
                      {order.address}
                    </td>
                    <td className="py-3 px-4 font-semibold">
                      ₦{(order.total_cost ?? 0).toLocaleString()}
                    </td>
                    <td className="py-3 px-4">
                      <select
                        value={order.status}
                        onChange={(e) =>
                          updateMut.mutate({
                            id: order.id,
                            status: e.target.value,
                          })
                        }
                        className={`text-xs font-semibold rounded-full px-2 py-1 border-0 bg-transparent cursor-pointer`}
                      >
                        {STATUS_OPTIONS.map((s) => (
                          <option
                            key={s}
                            value={s}
                            className="text-accent font-medium"
                          >
                            {s}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="py-3 px-4 pr-5 text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => setSelected(order)}
                      >
                        <Eye className="h-3.5 w-3.5" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && (
              <p className="text-center py-12 text-muted-foreground">
                No orders found.
              </p>
            )}
          </div>
        </div>
      )}

      {/* Order detail modal */}
      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Order Details</DialogTitle>
          </DialogHeader>
          {selected && (
            <div className="space-y-3 text-sm">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <p className="text-xs text-muted-foreground">Reference</p>
                  <p className="font-mono text-xs">{selected.reference}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Status</p>
                  <Badge
                    variant={
                      statusVariant[selected.status?.toLowerCase()] ?? "default"
                    }
                  >
                    {selected.status}
                  </Badge>
                </div>
                <div className="col-span-2">
                  <p className="text-xs text-muted-foreground">Address</p>
                  <p>{selected.address}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Phone</p>
                  <p>{selected.phone_number}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Total</p>
                  <p className="font-bold">
                    ₦{(selected.total_cost ?? 0).toLocaleString()}
                  </p>
                </div>
              </div>
              {selected.order_items?.length > 0 && (
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
                    Items
                  </p>
                  <div className="space-y-1">
                    {selected.order_items.map((item: any, i: number) => (
                      <div
                        key={i}
                        className="flex justify-between text-xs p-2 bg-muted rounded-lg"
                      >
                        <span>Product ID: {item.product?.slice(0, 8)}…</span>
                        <span className="font-semibold">×{item.quantity}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

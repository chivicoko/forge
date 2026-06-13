"use client";
export const dynamic = "force-dynamic";
import { useQuery } from "@tanstack/react-query";
import { listAllOrdersQueryOptions, listProductsQueryOptions } from "@/lib/api";
import { useUser } from "@clerk/nextjs";
import CountUp from "react-countup";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import {
  ShoppingCart,
  Package,
  TrendingUp,
  DollarSign,
  BadgeInfo,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { format, subDays } from "date-fns";

function StatCard({
  title,
  value,
  prefix = "",
  suffix = "",
  icon: Icon,
  color,
  trend,
  isLoading,
}: any) {
  return (
    <div className="bg-background border rounded-2xl p-5">
      <div className="flex items-start justify-between mb-3">
        <p className="text-sm font-semibold text-muted-foreground flex items-center gap-1">
          {title}
          <BadgeInfo className="h-3 w-3 opacity-50" />
        </p>
        <div
          className={`w-9 h-9 rounded-xl flex items-center justify-center ${color}`}
        >
          <Icon className="h-4 w-4" />
        </div>
      </div>
      {isLoading ? (
        <Skeleton className="h-9 w-24" />
      ) : (
        <p className="text-3xl font-black">
          {prefix}
          <CountUp end={value} duration={1.8} separator="," />
          {suffix}
        </p>
      )}
      <p
        className={`text-xs mt-2 flex items-center gap-1 ${trend >= 0 ? "text-green-600" : "text-destructive"}`}
      >
        {trend >= 0 ? (
          <ArrowUp className="h-3 w-3" />
        ) : (
          <ArrowDown className="h-3 w-3" />
        )}
        {Math.abs(trend)}% this week
      </p>
    </div>
  );
}

export default function DashboardOverviewPage() {
  const { user } = useUser();
  const { data: orders, isLoading: ordersLoading } = useQuery(
    listAllOrdersQueryOptions,
  );
  const { data: products, isLoading: productsLoading } = useQuery(
    listProductsQueryOptions,
  );

  const totalRevenue =
    orders
      ?.filter((o) => o.status === "paid")
      .reduce((acc, o) => acc + (o.total_cost ?? 0), 0) ?? 0;

  // Build chart data: last 7 days
  const chartData = Array.from({ length: 7 }, (_, i) => {
    const day = subDays(new Date(), 6 - i);
    const label = format(day, "EEE");
    const dayOrders = orders?.filter(
      (o) =>
        o.created_at &&
        format(new Date(o.created_at), "yyyy-MM-dd") ===
          format(day, "yyyy-MM-dd"),
    );
    const revenue =
      dayOrders
        ?.filter((o) => o.status === "paid")
        .reduce((a, o) => a + (o.total_cost ?? 0), 0) ?? 0;
    return { label, orders: dayOrders?.length ?? 0, revenue };
  });

  const recentOrders = orders?.slice(0, 8) ?? [];

  const statusColor: Record<string, any> = {
    paid: "success",
    pending: "warning",
    cancelled: "destructive",
  };

  return (
    <div className="space-y-6 max-w-7xl">
      <div>
        <h1 className="text-2xl font-black">
          Welcome back, {user?.firstName} 👋
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Here&apos;s what&apos;s happening with FORGE today.
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Orders"
          value={orders?.length ?? 0}
          icon={ShoppingCart}
          color="bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400"
          trend={12}
          isLoading={ordersLoading}
        />
        <StatCard
          title="Revenue"
          value={Math.round(totalRevenue / 1000)}
          prefix="₦"
          suffix="K"
          icon={DollarSign}
          color="bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400"
          trend={8}
          isLoading={ordersLoading}
        />
        <StatCard
          title="Products"
          value={products?.length ?? 0}
          icon={Package}
          color="bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-400"
          trend={3}
          isLoading={productsLoading}
        />
        <StatCard
          title="Pending"
          value={orders?.filter((o) => o.status === "pending").length ?? 0}
          icon={TrendingUp}
          color="bg-amber-100 dark:bg-amber-900 text-amber-600 dark:text-amber-400"
          trend={-5}
          isLoading={ordersLoading}
        />
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-4">
        <div className="bg-background border rounded-2xl p-5">
          <h2 className="font-bold mb-4 text-sm">Orders — Last 7 Days</h2>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={chartData} barSize={20}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis
                dataKey="label"
                tick={{ fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                allowDecimals={false}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: 8,
                  border: "1px solid hsl(var(--border))",
                  background: "hsl(var(--background))",
                }}
              />
              <Bar dataKey="orders" fill="#F59E0B" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-background border rounded-2xl p-5">
          <h2 className="font-bold mb-4 text-sm">Revenue — Last 7 Days (₦)</h2>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis
                dataKey="label"
                tick={{ fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: 8,
                  border: "1px solid hsl(var(--border))",
                  background: "hsl(var(--background))",
                }}
                formatter={(v: any) => [`₦${v.toLocaleString()}`, "Revenue"]}
              />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#F59E0B"
                strokeWidth={2}
                dot={{ fill: "#F59E0B", strokeWidth: 0, r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent orders table */}
      <div className="bg-background border rounded-2xl p-5">
        <h2 className="font-bold mb-4">Recent Orders</h2>
        {ordersLoading ? (
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full rounded-lg" />
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-muted-foreground text-xs uppercase tracking-wide">
                  <th className="text-left py-2 pr-4 font-semibold">
                    Reference
                  </th>
                  <th className="text-left py-2 pr-4 font-semibold hidden sm:table-cell">
                    Date
                  </th>
                  <th className="text-left py-2 pr-4 font-semibold hidden md:table-cell">
                    Address
                  </th>
                  <th className="text-right py-2 pr-4 font-semibold">Total</th>
                  <th className="text-right py-2 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {recentOrders.map((order) => (
                  <tr
                    key={order.id}
                    className="hover:bg-muted/40 transition-colors"
                  >
                    <td className="py-3 pr-4 font-mono text-xs">
                      {order.reference?.slice(0, 12)}…
                    </td>
                    <td className="py-3 pr-4 text-muted-foreground hidden sm:table-cell whitespace-nowrap">
                      {order.created_at
                        ? format(new Date(order.created_at), "MMM d, yy")
                        : "—"}
                    </td>
                    <td className="py-3 pr-4 text-muted-foreground hidden md:table-cell max-w-[180px] truncate">
                      {order.address}
                    </td>
                    <td className="py-3 pr-4 text-right font-semibold">
                      ₦{(order.total_cost ?? 0).toLocaleString()}
                    </td>
                    <td className="py-3 text-right">
                      <Badge
                        variant={
                          statusColor[order.status?.toLowerCase()] ?? "default"
                        }
                        className="text-xs"
                      >
                        {order.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {recentOrders.length === 0 && (
              <p className="text-center py-8 text-muted-foreground">
                No orders yet.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

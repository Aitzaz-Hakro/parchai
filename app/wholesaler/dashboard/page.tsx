import Link from "next/link";
import {
  ClipboardList,
  Clock,
  Plus,
  TrendingUp,
  Users,
} from "lucide-react";

import { requireWholesaler } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { formatPKR, formatNumber } from "@/lib/utils";
import { smartDate } from "@/lib/format";
import { PageHeader } from "@/components/portal/page-header";
import { StatCard } from "@/components/portal/stat-card";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { OrderStatusBadge } from "@/components/status-badge";
import { EmptyState } from "@/components/empty-state";

export default async function WholesalerDashboard() {
  const { profile, wholesaler } = await requireWholesaler();
  const supabase = await createClient();

  const now = new Date();
  const startOfToday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
  ).toISOString();
  const startOfMonth = new Date(
    now.getFullYear(),
    now.getMonth(),
    1,
  ).toISOString();

  const [
    ordersToday,
    pendingOrders,
    monthRevenue,
    activeRetailers,
    recent,
  ] = await Promise.all([
    supabase
      .from("orders")
      .select("id", { count: "exact", head: true })
      .gte("created_at", startOfToday),
    supabase
      .from("orders")
      .select("id", { count: "exact", head: true })
      .eq("status", "pending"),
    supabase
      .from("orders")
      .select("total")
      .neq("status", "cancelled")
      .gte("created_at", startOfMonth),
    supabase
      .from("wholesaler_retailer")
      .select("id", { count: "exact", head: true })
      .eq("status", "active"),
    supabase
      .from("orders")
      .select("*, retailers(shop_name), order_items(count)")
      .order("created_at", { ascending: false })
      .limit(8),
  ]);

  const revenue = (monthRevenue.data ?? []).reduce(
    (sum, o) => sum + Number(o.total),
    0,
  );

  const recentOrders = recent.data ?? [];

  return (
    <div>
      <PageHeader
        title={`Welcome, ${profile.full_name?.split(" ")[0] || "there"}`}
        description={`Here's what's happening at ${wholesaler.business_name} today.`}
        action={
          <>
            <Button asChild variant="outline">
              <Link href="/wholesaler/orders">View pending orders</Link>
            </Button>
            <Button asChild>
              <Link href="/wholesaler/products">
                <Plus className="h-4 w-4" /> Add product
              </Link>
            </Button>
          </>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={ClipboardList}
          label="Orders today"
          value={formatNumber(ordersToday.count ?? 0)}
        />
        <StatCard
          icon={Clock}
          label="Pending orders"
          value={formatNumber(pendingOrders.count ?? 0)}
          tone="accent"
        />
        <StatCard
          icon={TrendingUp}
          label="Revenue this month"
          value={formatPKR(revenue)}
          tone="green"
        />
        <StatCard
          icon={Users}
          label="Active retailers"
          value={formatNumber(activeRetailers.count ?? 0)}
        />
      </div>

      <Card className="mt-6">
        <CardHeader className="flex-row items-center justify-between space-y-0">
          <CardTitle>Recent orders</CardTitle>
          <Button asChild variant="ghost" size="sm">
            <Link href="/wholesaler/orders">View all</Link>
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          {recentOrders.length === 0 ? (
            <div className="p-6">
              <EmptyState
                icon={ClipboardList}
                title="No orders yet"
                description="When your retailers place orders, they'll show up here in real time."
              />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order</TableHead>
                  <TableHead>Retailer</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Time</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentOrders.map((order) => {
                  const itemCount =
                    (order.order_items as unknown as { count: number }[])?.[0]
                      ?.count ?? 0;
                  const shop =
                    (order.retailers as unknown as { shop_name: string } | null)
                      ?.shop_name ?? "—";
                  return (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">
                        {order.order_number}
                      </TableCell>
                      <TableCell>{shop}</TableCell>
                      <TableCell className="tabular-nums">
                        {formatNumber(itemCount)}
                      </TableCell>
                      <TableCell className="font-medium tabular-nums">
                        {formatPKR(order.total)}
                      </TableCell>
                      <TableCell>
                        <OrderStatusBadge status={order.status} />
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {smartDate(order.created_at)}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

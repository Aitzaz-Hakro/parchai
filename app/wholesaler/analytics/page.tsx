import { BarChart3, ClipboardList, TrendingUp } from "lucide-react";

import { requireWholesaler } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { formatNumber, formatPKR } from "@/lib/utils";
import { PageHeader } from "@/components/portal/page-header";
import { StatCard } from "@/components/portal/stat-card";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { EmptyState } from "@/components/empty-state";
import { OrderStatusBadge } from "@/components/status-badge";
import type { OrderStatus } from "@/lib/types";

export default async function WholesalerAnalyticsPage() {
  await requireWholesaler();
  const supabase = await createClient();

  const [{ data: items }, { data: orders }] = await Promise.all([
    supabase.from("order_items").select("product_name, quantity, line_total"),
    supabase.from("orders").select("status, total"),
  ]);

  const productMap = new Map<string, { qty: number; revenue: number }>();
  for (const it of items ?? []) {
    const cur = productMap.get(it.product_name) ?? { qty: 0, revenue: 0 };
    cur.qty += it.quantity;
    cur.revenue += Number(it.line_total);
    productMap.set(it.product_name, cur);
  }
  const topProducts = [...productMap.entries()]
    .map(([name, v]) => ({ name, ...v }))
    .sort((a, b) => b.qty - a.qty)
    .slice(0, 8);

  const statusCounts = new Map<OrderStatus, number>();
  let totalRevenue = 0;
  for (const o of orders ?? []) {
    statusCounts.set(o.status, (statusCounts.get(o.status) ?? 0) + 1);
    if (o.status !== "cancelled") totalRevenue += Number(o.total);
  }
  const maxQty = topProducts[0]?.qty ?? 1;
  const statuses: OrderStatus[] = [
    "pending",
    "confirmed",
    "dispatched",
    "delivered",
    "cancelled",
  ];

  return (
    <div>
      <PageHeader
        title="Analytics"
        description="See what sells and how your orders are moving."
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          icon={ClipboardList}
          label="Total orders"
          value={formatNumber(orders?.length ?? 0)}
        />
        <StatCard
          icon={TrendingUp}
          label="Total revenue"
          value={formatPKR(totalRevenue)}
          tone="green"
        />
        <StatCard
          icon={BarChart3}
          label="Products sold"
          value={formatNumber(
            [...productMap.values()].reduce((s, v) => s + v.qty, 0),
          )}
          tone="accent"
        />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Top selling products</CardTitle>
          </CardHeader>
          <CardContent>
            {topProducts.length === 0 ? (
              <EmptyState
                icon={BarChart3}
                title="No sales data yet"
                description="Once orders come in, your best sellers show here."
              />
            ) : (
              <div className="space-y-3">
                {topProducts.map((p) => (
                  <div key={p.name}>
                    <div className="mb-1 flex items-center justify-between text-sm">
                      <span className="font-medium">{p.name}</span>
                      <span className="tabular-nums text-muted-foreground">
                        {formatNumber(p.qty)} sold · {formatPKR(p.revenue)}
                      </span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full rounded-full bg-primary"
                        style={{ width: `${(p.qty / maxQty) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Orders by status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {statuses.map((s) => (
                <div
                  key={s}
                  className="flex items-center justify-between rounded-lg border p-3"
                >
                  <OrderStatusBadge status={s} />
                  <span className="font-semibold tabular-nums">
                    {formatNumber(statusCounts.get(s) ?? 0)}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

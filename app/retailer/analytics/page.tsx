import { BarChart3, ClipboardList, ShoppingBag } from "lucide-react";

import { requireRetailer } from "@/lib/auth";
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

export default async function RetailerAnalyticsPage() {
  await requireRetailer();
  const supabase = await createClient();

  const [{ data: items }, { data: orders }] = await Promise.all([
    supabase.from("order_items").select("product_name, quantity, line_total"),
    supabase.from("orders").select("total, status"),
  ]);

  const productMap = new Map<string, { qty: number; spent: number }>();
  for (const it of items ?? []) {
    const cur = productMap.get(it.product_name) ?? { qty: 0, spent: 0 };
    cur.qty += it.quantity;
    cur.spent += Number(it.line_total);
    productMap.set(it.product_name, cur);
  }
  const topProducts = [...productMap.entries()]
    .map(([name, v]) => ({ name, ...v }))
    .sort((a, b) => b.qty - a.qty)
    .slice(0, 8);
  const maxQty = topProducts[0]?.qty ?? 1;

  const totalSpent = (orders ?? [])
    .filter((o) => o.status !== "cancelled")
    .reduce((s, o) => s + Number(o.total), 0);

  return (
    <div>
      <PageHeader
        title="Analytics"
        description="See which items you order most and what you spend."
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          icon={ClipboardList}
          label="Total orders"
          value={formatNumber(orders?.length ?? 0)}
        />
        <StatCard
          icon={ShoppingBag}
          label="Total spent"
          value={formatPKR(totalSpent)}
          tone="green"
        />
        <StatCard
          icon={BarChart3}
          label="Items ordered"
          value={formatNumber(
            [...productMap.values()].reduce((s, v) => s + v.qty, 0),
          )}
          tone="accent"
        />
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Most ordered items</CardTitle>
        </CardHeader>
        <CardContent>
          {topProducts.length === 0 ? (
            <EmptyState
              icon={BarChart3}
              title="No order data yet"
              description="Place a few orders and your most-ordered items will show here."
            />
          ) : (
            <div className="space-y-3">
              {topProducts.map((p) => (
                <div key={p.name}>
                  <div className="mb-1 flex items-center justify-between text-sm">
                    <span className="font-medium">{p.name}</span>
                    <span className="tabular-nums text-muted-foreground">
                      {formatNumber(p.qty)} ordered · {formatPKR(p.spent)}
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
    </div>
  );
}

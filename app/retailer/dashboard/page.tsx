import Link from "next/link";
import { Boxes, ClipboardList, Plus, Store, Wallet } from "lucide-react";

import { requireRetailer } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { formatNumber, formatPKR } from "@/lib/utils";
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
import { OrderStatusBadge } from "@/components/status-badge";
import { EmptyState } from "@/components/empty-state";

export default async function RetailerDashboard() {
  const { profile } = await requireRetailer();
  const supabase = await createClient();

  const [{ data: udhaar }, { data: activeOrders }, { data: soldOut }, suppliers] =
    await Promise.all([
      supabase.from("udhaar").select("amount, type"),
      supabase
        .from("orders")
        .select("*, wholesalers(business_name)")
        .in("status", ["pending", "confirmed", "dispatched"])
        .order("created_at", { ascending: false })
        .limit(5),
      supabase
        .from("stock_tracker")
        .select("*, products(name)")
        .eq("status", "sold_out")
        .order("created_at", { ascending: false })
        .limit(6),
      supabase
        .from("wholesaler_retailer")
        .select("id", { count: "exact", head: true })
        .eq("status", "active"),
    ]);

  const balance = (udhaar ?? []).reduce(
    (sum, u) => sum + (u.type === "credit" ? Number(u.amount) : -Number(u.amount)),
    0,
  );

  const orders = activeOrders ?? [];
  const lowStock = soldOut ?? [];

  return (
    <div>
      <PageHeader
        title={`Assalam-o-Alaikum, ${profile.full_name?.split(" ")[0] || "ji"}`}
        description="Here's your shop at a glance."
        action={
          <Button asChild>
            <Link href="/retailer/suppliers">
              <Plus className="h-4 w-4" /> New order
            </Link>
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="p-5 sm:col-span-1">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-muted-foreground">
              Total udhaar balance
            </p>
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-rose-100 text-rose-700">
              <Wallet className="h-[18px] w-[18px]" />
            </span>
          </div>
          <p
            className={`mt-3 font-heading text-3xl font-bold tabular-nums ${
              balance > 0 ? "text-rose-600" : "text-emerald-600"
            }`}
          >
            {formatPKR(balance)}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Across all your suppliers
          </p>
        </Card>
        <StatCard
          icon={ClipboardList}
          label="Active orders"
          value={formatNumber(orders.length)}
          tone="primary"
        />
        <StatCard
          icon={Store}
          label="My suppliers"
          value={formatNumber(suppliers.count ?? 0)}
          tone="accent"
        />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <CardTitle>Active orders</CardTitle>
            <Button asChild variant="ghost" size="sm">
              <Link href="/retailer/orders">View all</Link>
            </Button>
          </CardHeader>
          <CardContent>
            {orders.length === 0 ? (
              <EmptyState
                icon={ClipboardList}
                title="No active orders"
                description="Place an order with one of your suppliers to get started."
                action={
                  <Button asChild>
                    <Link href="/retailer/suppliers">Browse suppliers</Link>
                  </Button>
                }
              />
            ) : (
              <div className="divide-y rounded-lg border">
                {orders.map((o) => (
                  <div
                    key={o.id}
                    className="flex items-center justify-between p-3"
                  >
                    <div>
                      <p className="text-sm font-medium">{o.order_number}</p>
                      <p className="text-xs text-muted-foreground">
                        {(o.wholesalers as unknown as {
                          business_name: string;
                        } | null)?.business_name ?? "—"}{" "}
                        · {smartDate(o.created_at)}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <OrderStatusBadge status={o.status} />
                      <span className="text-sm font-semibold tabular-nums">
                        {formatPKR(o.total)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <CardTitle>Needs reorder</CardTitle>
            <Button asChild variant="ghost" size="sm">
              <Link href="/retailer/stock">Stock tracker</Link>
            </Button>
          </CardHeader>
          <CardContent>
            {lowStock.length === 0 ? (
              <EmptyState
                icon={Boxes}
                title="Nothing marked sold out"
                description="Mark items as sold out in the stock tracker to remember to reorder."
              />
            ) : (
              <div className="flex flex-wrap gap-2">
                {lowStock.map((s) => (
                  <span
                    key={s.id}
                    className="inline-flex items-center gap-1.5 rounded-full border bg-rose-50 px-3 py-1.5 text-sm text-rose-700"
                  >
                    <Boxes className="h-3.5 w-3.5" />
                    {(s.products as unknown as { name: string } | null)?.name ??
                      s.custom_item_name ??
                      "Item"}
                  </span>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

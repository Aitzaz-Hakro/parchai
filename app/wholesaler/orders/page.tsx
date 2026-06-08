import { requireWholesaler } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/portal/page-header";
import {
  OrdersManager,
  type OrderRow,
} from "@/components/wholesaler/orders-manager";

export default async function WholesalerOrdersPage() {
  const { wholesaler } = await requireWholesaler();
  const supabase = await createClient();

  const { data } = await supabase
    .from("orders")
    .select("*, retailers(shop_name), order_items(count)")
    .order("created_at", { ascending: false });

  const orders: OrderRow[] = (data ?? []).map((o) => ({
    id: o.id,
    order_number: o.order_number,
    shop_name:
      (o.retailers as unknown as { shop_name: string } | null)?.shop_name ??
      "—",
    item_count:
      (o.order_items as unknown as { count: number }[])?.[0]?.count ?? 0,
    total: Number(o.total),
    status: o.status,
    created_at: o.created_at,
  }));

  return (
    <div>
      <PageHeader
        title="Orders"
        description="Review and fulfil incoming orders. Updates arrive live."
      />
      <OrdersManager initialOrders={orders} wholesalerId={wholesaler.id} />
    </div>
  );
}

import { requireRetailer } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/portal/page-header";
import {
  RetailerOrdersList,
  type RetailerOrderRow,
} from "@/components/retailer/orders-list";

export default async function RetailerOrdersPage() {
  const { retailer } = await requireRetailer();
  const supabase = await createClient();

  const { data } = await supabase
    .from("orders")
    .select("*, wholesalers(business_name), order_items(count)")
    .order("created_at", { ascending: false });

  const orders: RetailerOrderRow[] = (data ?? []).map((o) => ({
    id: o.id,
    order_number: o.order_number,
    business_name:
      (o.wholesalers as unknown as { business_name: string } | null)
        ?.business_name ?? "—",
    total: Number(o.total),
    status: o.status,
    created_at: o.created_at,
    item_count:
      (o.order_items as unknown as { count: number }[])?.[0]?.count ?? 0,
  }));

  return (
    <div>
      <PageHeader
        title="My Orders"
        description="Track every order from placed to delivered. Updates arrive live."
      />
      <RetailerOrdersList initialOrders={orders} retailerId={retailer.id} />
    </div>
  );
}

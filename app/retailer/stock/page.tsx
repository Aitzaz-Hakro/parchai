import { requireRetailer } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/portal/page-header";
import {
  StockTracker,
  type StockItem,
} from "@/components/retailer/stock-tracker";

export default async function RetailerStockPage() {
  const { retailer } = await requireRetailer();
  const supabase = await createClient();

  const { data } = await supabase
    .from("stock_tracker")
    .select("id, custom_item_name, products(name, wholesaler_id)")
    .eq("status", "sold_out")
    .order("created_at", { ascending: false });

  const items: StockItem[] = (data ?? []).map((s) => {
    const product = s.products as unknown as {
      name: string;
      wholesaler_id: string;
    } | null;
    return {
      id: s.id,
      name: product?.name ?? s.custom_item_name ?? "Item",
      wholesaler_id: product?.wholesaler_id ?? null,
    };
  });

  return (
    <div>
      <PageHeader
        title="Stock Tracker"
        description="Log sold-out items so you never forget to reorder."
      />
      <StockTracker initialItems={items} retailerId={retailer.id} />
    </div>
  );
}

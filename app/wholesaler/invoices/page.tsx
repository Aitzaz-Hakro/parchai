import { requireWholesaler } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/portal/page-header";
import {
  UdhaarManager,
  type UdhaarRow,
} from "@/components/wholesaler/udhaar-manager";

export default async function WholesalerInvoicesPage() {
  const { wholesaler } = await requireWholesaler();
  const supabase = await createClient();

  const [{ data: links }, { data: udhaar }] = await Promise.all([
    supabase
      .from("wholesaler_retailer")
      .select("retailer_id, credit_limit, retailers(shop_name)")
      .order("created_at", { ascending: false }),
    supabase.from("udhaar").select("retailer_id, amount, type"),
  ]);

  const balances = new Map<string, number>();
  for (const u of udhaar ?? []) {
    const delta = u.type === "credit" ? Number(u.amount) : -Number(u.amount);
    balances.set(u.retailer_id, (balances.get(u.retailer_id) ?? 0) + delta);
  }

  const rows: UdhaarRow[] = (links ?? []).map((l) => ({
    retailer_id: l.retailer_id,
    shop_name:
      (l.retailers as unknown as { shop_name: string } | null)?.shop_name ??
      "—",
    credit_limit: Number(l.credit_limit),
    balance: balances.get(l.retailer_id) ?? 0,
  }));

  return (
    <div>
      <PageHeader
        title="Invoices & Udhaar"
        description="Track per-retailer balances and record payments received."
      />
      <UdhaarManager initialRows={rows} wholesalerId={wholesaler.id} />
    </div>
  );
}

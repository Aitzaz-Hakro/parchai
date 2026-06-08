import { requireRetailer } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/portal/page-header";
import {
  UdhaarView,
  type SupplierBalance,
} from "@/components/retailer/udhaar-view";

export default async function RetailerUdhaarPage() {
  await requireRetailer();
  const supabase = await createClient();

  const [{ data: links }, { data: udhaar }] = await Promise.all([
    supabase
      .from("wholesaler_retailer")
      .select("wholesaler_id, wholesalers(business_name)"),
    supabase.from("udhaar").select("wholesaler_id, amount, type"),
  ]);

  const balances = new Map<string, number>();
  for (const u of udhaar ?? []) {
    const delta = u.type === "credit" ? Number(u.amount) : -Number(u.amount);
    balances.set(u.wholesaler_id, (balances.get(u.wholesaler_id) ?? 0) + delta);
  }

  const rows: SupplierBalance[] = (links ?? []).map((l) => ({
    wholesaler_id: l.wholesaler_id,
    business_name:
      (l.wholesalers as unknown as { business_name: string } | null)
        ?.business_name ?? "—",
    balance: balances.get(l.wholesaler_id) ?? 0,
  }));

  return (
    <div>
      <PageHeader
        title="Udhaar"
        description="Your running balance and history with each supplier."
      />
      <UdhaarView rows={rows} />
    </div>
  );
}

import { requireRetailer } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/portal/page-header";
import {
  SuppliersManager,
  type SupplierRow,
} from "@/components/retailer/suppliers-manager";

export default async function RetailerSuppliersPage() {
  const { retailer } = await requireRetailer();
  const supabase = await createClient();

  const [{ data: links }, { data: udhaar }] = await Promise.all([
    supabase
      .from("wholesaler_retailer")
      .select("id, status, wholesaler_id, wholesalers(business_name, city)")
      .order("created_at", { ascending: false }),
    supabase.from("udhaar").select("wholesaler_id, amount, type"),
  ]);

  const balances = new Map<string, number>();
  for (const u of udhaar ?? []) {
    const delta = u.type === "credit" ? Number(u.amount) : -Number(u.amount);
    balances.set(u.wholesaler_id, (balances.get(u.wholesaler_id) ?? 0) + delta);
  }

  const rows: SupplierRow[] = (links ?? []).map((l) => {
    const w = l.wholesalers as unknown as {
      business_name: string;
      city: string | null;
    } | null;
    return {
      link_id: l.id,
      wholesaler_id: l.wholesaler_id,
      business_name: w?.business_name ?? "—",
      city: w?.city ?? null,
      status: l.status,
      balance: balances.get(l.wholesaler_id) ?? 0,
    };
  });

  return (
    <div>
      <PageHeader
        title="My Suppliers"
        description="Browse catalogues and place orders with your linked suppliers."
      />
      <SuppliersManager initialRows={rows} retailerId={retailer.id} />
    </div>
  );
}

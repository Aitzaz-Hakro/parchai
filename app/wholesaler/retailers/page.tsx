import { requireWholesaler } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/portal/page-header";
import {
  RetailersManager,
  type RetailerRow,
} from "@/components/wholesaler/retailers-manager";

export default async function WholesalerRetailersPage() {
  const { wholesaler } = await requireWholesaler();
  const supabase = await createClient();

  const [{ data: links }, { data: udhaar }] = await Promise.all([
    supabase
      .from("wholesaler_retailer")
      .select(
        "id, credit_limit, status, retailer_id, retailers(shop_name, city, profiles(full_name, phone))",
      )
      .order("created_at", { ascending: false }),
    supabase.from("udhaar").select("retailer_id, amount, type"),
  ]);

  const balances = new Map<string, number>();
  for (const u of udhaar ?? []) {
    const delta = u.type === "credit" ? Number(u.amount) : -Number(u.amount);
    balances.set(u.retailer_id, (balances.get(u.retailer_id) ?? 0) + delta);
  }

  const rows: RetailerRow[] = (links ?? []).map((l) => {
    const retailer = l.retailers as unknown as {
      shop_name: string;
      city: string | null;
      profiles: { full_name: string | null; phone: string | null } | null;
    } | null;
    return {
      link_id: l.id,
      retailer_id: l.retailer_id,
      shop_name: retailer?.shop_name ?? "—",
      city: retailer?.city ?? null,
      full_name: retailer?.profiles?.full_name ?? null,
      phone: retailer?.profiles?.phone ?? null,
      credit_limit: Number(l.credit_limit),
      status: l.status,
      balance: balances.get(l.retailer_id) ?? 0,
    };
  });

  return (
    <div>
      <PageHeader
        title="Retailers"
        description="Manage the shops linked to your business."
      />
      <RetailersManager initialRows={rows} wholesalerId={wholesaler.id} />
    </div>
  );
}

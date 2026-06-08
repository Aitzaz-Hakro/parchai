import { requireWholesaler } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/portal/page-header";
import { ProductsManager } from "@/components/wholesaler/products-manager";

export default async function WholesalerProductsPage() {
  const { wholesaler } = await requireWholesaler();
  const supabase = await createClient();

  const { data: products } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div>
      <PageHeader
        title="Products"
        description="Manage your catalogue, prices and stock."
      />
      <ProductsManager
        initialProducts={products ?? []}
        wholesalerId={wholesaler.id}
      />
    </div>
  );
}

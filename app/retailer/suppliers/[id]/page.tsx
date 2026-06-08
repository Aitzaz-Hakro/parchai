import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { requireRetailer } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/portal/page-header";
import { Catalogue } from "@/components/retailer/catalogue";

export default async function BrowseSupplierPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireRetailer();
  const { id } = await params;
  const supabase = await createClient();

  const { data: wholesaler } = await supabase
    .from("wholesalers")
    .select("id, business_name, city")
    .eq("id", id)
    .single();

  if (!wholesaler) notFound();

  const { data: products } = await supabase
    .from("products")
    .select("*")
    .eq("wholesaler_id", id)
    .eq("is_active", true)
    .order("name", { ascending: true });

  return (
    <div>
      <Button asChild variant="ghost" size="sm" className="mb-3 -ml-2">
        <Link href="/retailer/suppliers">
          <ArrowLeft className="h-4 w-4" /> Back to suppliers
        </Link>
      </Button>
      <PageHeader
        title={wholesaler.business_name}
        description={`${wholesaler.city ?? ""} · Browse and order from this supplier.`}
      />
      <Catalogue
        wholesalerId={wholesaler.id}
        businessName={wholesaler.business_name}
        products={products ?? []}
      />
    </div>
  );
}

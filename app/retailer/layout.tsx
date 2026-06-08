import { requireRetailer } from "@/lib/auth";
import { PortalShell } from "@/components/portal/portal-shell";

export default async function RetailerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { profile, retailer } = await requireRetailer();

  return (
    <PortalShell
      portal="retailer"
      user={{
        name: profile.full_name || "Retailer",
        subtitle: retailer.shop_name,
        email: profile.email || "",
      }}
    >
      {children}
    </PortalShell>
  );
}

import { requireWholesaler } from "@/lib/auth";
import { PortalShell } from "@/components/portal/portal-shell";

export default async function WholesalerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { profile, wholesaler } = await requireWholesaler();

  return (
    <PortalShell
      portal="wholesaler"
      user={{
        name: profile.full_name || "Wholesaler",
        subtitle: wholesaler.business_name,
        email: profile.email || "",
      }}
    >
      {children}
    </PortalShell>
  );
}

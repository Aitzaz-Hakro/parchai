import { requireWholesaler } from "@/lib/auth";
import { getSessionProfile } from "@/lib/auth";
import { PageHeader } from "@/components/portal/page-header";
import { SettingsForm } from "@/components/portal/settings-form";

export default async function WholesalerSettingsPage() {
  const { profile, wholesaler } = await requireWholesaler();
  const session = await getSessionProfile();

  return (
    <div>
      <PageHeader
        title="Settings"
        description="Update your profile and business details."
      />
      <SettingsForm
        userId={session!.userId}
        portal="wholesaler"
        initial={{
          full_name: profile.full_name ?? "",
          phone: profile.phone ?? "",
          city: profile.city ?? "",
          email: profile.email ?? "",
          orgName: wholesaler.business_name,
          orgId: wholesaler.id,
        }}
      />
    </div>
  );
}

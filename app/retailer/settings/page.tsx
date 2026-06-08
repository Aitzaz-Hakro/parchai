import { getSessionProfile, requireRetailer } from "@/lib/auth";
import { PageHeader } from "@/components/portal/page-header";
import { SettingsForm } from "@/components/portal/settings-form";

export default async function RetailerSettingsPage() {
  const { profile, retailer } = await requireRetailer();
  const session = await getSessionProfile();

  return (
    <div>
      <PageHeader
        title="Settings"
        description="Update your profile and shop details."
      />
      <SettingsForm
        userId={session!.userId}
        portal="retailer"
        initial={{
          full_name: profile.full_name ?? "",
          phone: profile.phone ?? "",
          city: profile.city ?? "",
          email: profile.email ?? "",
          orgName: retailer.shop_name,
          orgId: retailer.id,
        }}
      />
    </div>
  );
}

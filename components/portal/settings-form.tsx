"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function SettingsForm({
  userId,
  portal,
  initial,
}: {
  userId: string;
  portal: "wholesaler" | "retailer";
  initial: {
    full_name: string;
    phone: string;
    city: string;
    email: string;
    orgName: string;
    orgId: string;
  };
}) {
  const router = useRouter();
  const supabase = React.useMemo(() => createClient(), []);
  const [form, setForm] = React.useState({
    full_name: initial.full_name,
    phone: initial.phone,
    city: initial.city,
    orgName: initial.orgName,
  });
  const [saving, setSaving] = React.useState(false);

  const orgLabel = portal === "wholesaler" ? "Business name" : "Shop name";

  async function save(ev: React.FormEvent) {
    ev.preventDefault();
    setSaving(true);

    const { error: profileError } = await supabase
      .from("profiles")
      .update({
        full_name: form.full_name,
        phone: form.phone,
        city: form.city,
      })
      .eq("id", userId);

    const orgError = portal === "wholesaler"
      ? (
          await supabase
            .from("wholesalers")
            .update({ business_name: form.orgName, city: form.city })
            .eq("id", initial.orgId)
        ).error
      : (
          await supabase
            .from("retailers")
            .update({ shop_name: form.orgName, city: form.city })
            .eq("id", initial.orgId)
        ).error;

    setSaving(false);
    if (profileError || orgError) {
      toast.error((profileError || orgError)?.message ?? "Could not save");
      return;
    }
    toast.success("Settings saved");
    router.refresh();
  }

  return (
    <Card className="max-w-2xl">
      <CardHeader>
        <CardTitle>Profile &amp; business</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={save} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="full_name">Full name</Label>
            <Input
              id="full_name"
              value={form.full_name}
              onChange={(e) =>
                setForm((f) => ({ ...f, full_name: e.target.value }))
              }
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="orgName">{orgLabel}</Label>
            <Input
              id="orgName"
              value={form.orgName}
              onChange={(e) =>
                setForm((f) => ({ ...f, orgName: e.target.value }))
              }
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={form.phone}
                onChange={(e) =>
                  setForm((f) => ({ ...f, phone: e.target.value }))
                }
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                value={form.city}
                onChange={(e) =>
                  setForm((f) => ({ ...f, city: e.target.value }))
                }
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input id="email" value={initial.email} disabled />
            <p className="text-xs text-muted-foreground">
              Email cannot be changed here.
            </p>
          </div>
          <Button type="submit" disabled={saving}>
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Saving…
              </>
            ) : (
              "Save changes"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

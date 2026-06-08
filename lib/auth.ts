import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import type { Profile, Retailer, Wholesaler } from "@/lib/types";

export async function getSessionProfile(): Promise<{
  userId: string;
  profile: Profile;
} | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (!profile) return null;
  return { userId: user.id, profile };
}

export async function requireWholesaler(): Promise<{
  profile: Profile;
  wholesaler: Wholesaler;
}> {
  const session = await getSessionProfile();
  if (!session) redirect("/login");
  if (session.profile.role !== "wholesaler") redirect("/retailer/dashboard");

  const supabase = await createClient();
  const { data: wholesaler } = await supabase
    .from("wholesalers")
    .select("*")
    .eq("profile_id", session.userId)
    .single();

  if (!wholesaler) redirect("/login");
  return { profile: session.profile, wholesaler };
}

export async function requireRetailer(): Promise<{
  profile: Profile;
  retailer: Retailer;
}> {
  const session = await getSessionProfile();
  if (!session) redirect("/login");
  if (session.profile.role !== "retailer") redirect("/wholesaler/dashboard");

  const supabase = await createClient();
  const { data: retailer } = await supabase
    .from("retailers")
    .select("*")
    .eq("profile_id", session.userId)
    .single();

  if (!retailer) redirect("/login");
  return { profile: session.profile, retailer };
}

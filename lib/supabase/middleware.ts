import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

import type { Database } from "@/lib/types";

const PROTECTED_PREFIXES = ["/wholesaler", "/retailer"];
const AUTH_PAGES = ["/login", "/signup"];

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // IMPORTANT: do not run code between createServerClient and getUser().
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;
  const isProtected = PROTECTED_PREFIXES.some((p) => pathname.startsWith(p));
  const isAuthPage = AUTH_PAGES.some((p) => pathname.startsWith(p));

  // Not signed in and trying to reach a protected route -> login
  if (!user && isProtected) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("redirect", pathname);
    return NextResponse.redirect(url);
  }

  if (user) {
    // Resolve role for gating
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    const role = profile?.role;
    const home =
      role === "wholesaler" ? "/wholesaler/dashboard" : "/retailer/dashboard";

    // Signed in but on an auth page -> send to their dashboard
    if (isAuthPage) {
      const url = request.nextUrl.clone();
      url.pathname = home;
      url.search = "";
      return NextResponse.redirect(url);
    }

    // Role gating: keep each role within its own portal
    if (role === "retailer" && pathname.startsWith("/wholesaler")) {
      const url = request.nextUrl.clone();
      url.pathname = "/retailer/dashboard";
      return NextResponse.redirect(url);
    }
    if (role === "wholesaler" && pathname.startsWith("/retailer")) {
      const url = request.nextUrl.clone();
      url.pathname = "/wholesaler/dashboard";
      return NextResponse.redirect(url);
    }
  }

  return supabaseResponse;
}

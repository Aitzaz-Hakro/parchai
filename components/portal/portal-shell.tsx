"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  BarChart3,
  Boxes,
  ClipboardList,
  FileText,
  LayoutDashboard,
  LogOut,
  Menu,
  Settings,
  Store,
  Users,
  Wallet,
  X,
  type LucideIcon,
} from "lucide-react";

import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { BrandLogo } from "@/components/brand-logo";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type NavItem = { label: string; href: string; icon: LucideIcon };

const WHOLESALER_NAV: NavItem[] = [
  { label: "Dashboard", href: "/wholesaler/dashboard", icon: LayoutDashboard },
  { label: "Products", href: "/wholesaler/products", icon: Boxes },
  { label: "Orders", href: "/wholesaler/orders", icon: ClipboardList },
  { label: "Retailers", href: "/wholesaler/retailers", icon: Users },
  { label: "Invoices", href: "/wholesaler/invoices", icon: FileText },
  { label: "Analytics", href: "/wholesaler/analytics", icon: BarChart3 },
  { label: "Settings", href: "/wholesaler/settings", icon: Settings },
];

const RETAILER_NAV: NavItem[] = [
  { label: "Dashboard", href: "/retailer/dashboard", icon: LayoutDashboard },
  { label: "My Suppliers", href: "/retailer/suppliers", icon: Store },
  { label: "Orders", href: "/retailer/orders", icon: ClipboardList },
  { label: "Stock Tracker", href: "/retailer/stock", icon: Boxes },
  { label: "Udhaar", href: "/retailer/udhaar", icon: Wallet },
  { label: "Analytics", href: "/retailer/analytics", icon: BarChart3 },
  { label: "Settings", href: "/retailer/settings", icon: Settings },
];

// Five key tabs for the mobile bottom navigation.
const MOBILE_COUNT = 5;

export function PortalShell({
  portal,
  user,
  children,
}: {
  portal: "wholesaler" | "retailer";
  user: { name: string; subtitle: string; email: string };
  children: React.ReactNode;
}) {
  const nav = portal === "wholesaler" ? WHOLESALER_NAV : RETAILER_NAV;
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href + "/");

  async function signOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-60 flex-col border-r border-sidebar-border bg-sidebar md:flex">
        <div className="flex h-16 items-center border-b border-sidebar-border px-5">
          <Link href={`/${portal}/dashboard`}>
            <BrandLogo />
          </Link>
        </div>
        <nav className="flex-1 space-y-1 overflow-y-auto p-3">
          {nav.map((item) => (
            <SidebarLink key={item.href} item={item} active={isActive(item.href)} />
          ))}
        </nav>
        <div className="border-t border-sidebar-border p-3">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium capitalize text-primary">
            {portal}
          </span>
        </div>
      </aside>

      {/* Mobile drawer */}
      {mobileOpen ? (
        <div className="fixed inset-0 z-40 md:hidden">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="absolute inset-y-0 left-0 flex w-64 flex-col bg-sidebar shadow-xl">
            <div className="flex h-16 items-center justify-between border-b border-sidebar-border px-5">
              <BrandLogo />
              <button onClick={() => setMobileOpen(false)} aria-label="Close menu">
                <X className="h-5 w-5" />
              </button>
            </div>
            <nav className="flex-1 space-y-1 overflow-y-auto p-3">
              {nav.map((item) => (
                <SidebarLink
                  key={item.href}
                  item={item}
                  active={isActive(item.href)}
                  onClick={() => setMobileOpen(false)}
                />
              ))}
            </nav>
          </aside>
        </div>
      ) : null}

      {/* Main column */}
      <div className="flex min-h-screen flex-col md:pl-60">
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between gap-3 border-b bg-background/90 px-4 backdrop-blur-md sm:px-6">
          <button
            className="inline-flex h-10 w-10 items-center justify-center rounded-md md:hidden"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>

          <div className="hidden md:block">
            <p className="text-sm font-semibold">{user.subtitle}</p>
          </div>

          <div className="ml-auto">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 rounded-full p-1 pr-3 transition-colors hover:bg-secondary">
                  <Avatar className="h-9 w-9">
                    <AvatarFallback>
                      {user.name.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden text-left sm:block">
                    <span className="block text-sm font-medium leading-tight">
                      {user.name}
                    </span>
                    <span className="block text-xs text-muted-foreground">
                      {user.email}
                    </span>
                  </span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <p className="font-medium">{user.name}</p>
                  <p className="text-xs font-normal text-muted-foreground">
                    {user.subtitle}
                  </p>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href={`/${portal}/settings`}>
                    <Settings className="h-4 w-4" /> Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={signOut}
                  className="text-destructive focus:text-destructive"
                >
                  <LogOut className="h-4 w-4" /> Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        <main className="flex-1 px-4 pb-24 pt-6 sm:px-6 md:pb-10">{children}</main>

        {/* Mobile bottom nav */}
        <nav className="fixed inset-x-0 bottom-0 z-20 grid grid-cols-5 border-t bg-background md:hidden">
          {nav.slice(0, MOBILE_COUNT).map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-col items-center justify-center gap-0.5 py-2 text-[11px]",
                  active ? "text-primary" : "text-muted-foreground",
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.label.split(" ")[0]}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}

function SidebarLink({
  item,
  active,
  onClick,
}: {
  item: NavItem;
  active: boolean;
  onClick?: () => void;
}) {
  return (
    <Link
      href={item.href}
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
        active
          ? "bg-sidebar-primary text-sidebar-primary-foreground"
          : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
      )}
    >
      <item.icon className="h-[18px] w-[18px]" />
      {item.label}
    </Link>
  );
}

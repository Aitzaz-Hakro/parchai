"use client";

import * as React from "react";
import { PackageCheck, Receipt, TrendingUp } from "lucide-react";

import { formatPKR } from "@/lib/utils";

/**
 * Hero visual. Tries to render the supplied reference image at /hero.webp.
 * If that file isn't present yet, it gracefully falls back to a branded
 * dashboard-style illustration so the page never looks broken.
 */
export function HeroVisual() {
  const [imageOk, setImageOk] = React.useState(true);

  return (
    <div className="relative">
      <div className="absolute -inset-4 -z-10 rounded-[2rem] bg-gradient-to-tr from-primary/20 via-accent/10 to-transparent blur-2xl" />
      {imageOk ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src="/hero.webp"
          alt="Parchai dashboard preview"
          className="w-full rounded-2xl border border-border bg-card object-cover shadow-xl"
          onError={() => setImageOk(false)}
        />
      ) : (
        <FallbackMock />
      )}
    </div>
  );
}

function FallbackMock() {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-xl">
      <div className="flex items-center gap-1.5 border-b bg-muted/40 px-4 py-3">
        <span className="h-2.5 w-2.5 rounded-full bg-rose-400" />
        <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
        <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
        <span className="ml-3 text-xs font-medium text-muted-foreground">
          parchai · wholesaler dashboard
        </span>
      </div>
      <div className="space-y-4 p-5">
        <div className="grid grid-cols-3 gap-3">
          <MiniStat
            icon={<PackageCheck className="h-4 w-4" />}
            label="Orders today"
            value="28"
          />
          <MiniStat
            icon={<TrendingUp className="h-4 w-4" />}
            label="Revenue"
            value={formatPKR(184500)}
          />
          <MiniStat
            icon={<Receipt className="h-4 w-4" />}
            label="Udhaar"
            value={formatPKR(42300)}
          />
        </div>
        <div className="rounded-xl border bg-background p-4">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-sm font-semibold">Recent orders</span>
            <span className="text-xs text-muted-foreground">Live</span>
          </div>
          <div className="space-y-2.5">
            {[
              { shop: "Al-Madina Kiryana", total: 12400, tone: "amber" },
              { shop: "Bismillah Store", total: 8650, tone: "blue" },
              { shop: "New Sabir Traders", total: 23100, tone: "green" },
            ].map((row) => (
              <div
                key={row.shop}
                className="flex items-center justify-between rounded-lg bg-muted/40 px-3 py-2"
              >
                <div className="flex items-center gap-2.5">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                    {row.shop.slice(0, 2)}
                  </span>
                  <span className="text-sm font-medium">{row.shop}</span>
                </div>
                <span className="text-sm font-semibold tabular-nums">
                  {formatPKR(row.total)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function MiniStat({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border bg-background p-3">
      <div className="mb-2 flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
        {icon}
      </div>
      <p className="text-[11px] text-muted-foreground">{label}</p>
      <p className="text-sm font-bold tabular-nums">{value}</p>
    </div>
  );
}

"use client";

import * as React from "react";
import { Loader2, Wallet } from "lucide-react";

import { createClient } from "@/lib/supabase/client";
import { formatPKR } from "@/lib/utils";
import { smartDate } from "@/lib/format";
import type { UdhaarType } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { EmptyState } from "@/components/empty-state";

export type SupplierBalance = {
  wholesaler_id: string;
  business_name: string;
  balance: number;
};

export function UdhaarView({ rows }: { rows: SupplierBalance[] }) {
  const [ledgerFor, setLedgerFor] = React.useState<SupplierBalance | null>(
    null,
  );
  const totalBalance = rows.reduce((s, r) => s + r.balance, 0);

  return (
    <div>
      <Card className="mb-5 flex items-center justify-between p-5">
        <div>
          <p className="text-sm font-medium text-muted-foreground">
            Total udhaar balance
          </p>
          <p
            className={`mt-1 font-heading text-2xl font-bold tabular-nums ${
              totalBalance > 0 ? "text-rose-600" : "text-emerald-600"
            }`}
          >
            {formatPKR(totalBalance)}
          </p>
        </div>
        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-rose-100 text-rose-700">
          <Wallet className="h-5 w-5" />
        </span>
      </Card>

      {rows.length === 0 ? (
        <EmptyState
          icon={Wallet}
          title="No balances yet"
          description="Your credit and payment history with each supplier appears here."
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {rows.map((row) => (
            <Card key={row.wholesaler_id} className="flex flex-col p-5">
              <p className="font-semibold">{row.business_name}</p>
              <p
                className={`mt-2 font-heading text-xl font-bold tabular-nums ${
                  row.balance > 0 ? "text-rose-600" : "text-emerald-600"
                }`}
              >
                {formatPKR(row.balance)}
              </p>
              <p className="text-xs text-muted-foreground">
                {row.balance > 0 ? "You owe" : "Settled / advance"}
              </p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => setLedgerFor(row)}
              >
                View ledger
              </Button>
            </Card>
          ))}
        </div>
      )}

      <LedgerSheet
        row={ledgerFor}
        onOpenChange={(o) => !o && setLedgerFor(null)}
      />
    </div>
  );
}

function LedgerSheet({
  row,
  onOpenChange,
}: {
  row: SupplierBalance | null;
  onOpenChange: (o: boolean) => void;
}) {
  const supabase = React.useMemo(() => createClient(), []);
  const [entries, setEntries] = React.useState<
    | {
        id: string;
        description: string | null;
        amount: number;
        type: UdhaarType;
        running_balance: number;
        entry_date: string;
      }[]
    | null
  >(null);

  React.useEffect(() => {
    if (!row) return;
    setEntries(null);
    (async () => {
      const { data } = await supabase
        .from("udhaar")
        .select("id, description, amount, type, running_balance, entry_date")
        .eq("wholesaler_id", row.wholesaler_id)
        .order("entry_date", { ascending: false });
      setEntries(
        (data ?? []).map((x) => ({
          ...x,
          amount: Number(x.amount),
          running_balance: Number(x.running_balance),
        })),
      );
    })();
  }, [row, supabase]);

  return (
    <Sheet open={!!row} onOpenChange={onOpenChange}>
      <SheetContent>
        {row ? (
          <>
            <SheetHeader>
              <SheetTitle>{row.business_name}</SheetTitle>
              <SheetDescription>Transaction history</SheetDescription>
            </SheetHeader>
            <div className="flex-1 p-6">
              {entries === null ? (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" /> Loading…
                </div>
              ) : entries.length === 0 ? (
                <EmptyState
                  icon={Wallet}
                  title="No transactions"
                  description="No credit or payments recorded with this supplier yet."
                />
              ) : (
                <div className="divide-y rounded-lg border">
                  {entries.map((e) => (
                    <div
                      key={e.id}
                      className="flex items-center justify-between p-3"
                    >
                      <div>
                        <p className="text-sm font-medium">
                          {e.description ??
                            (e.type === "credit" ? "Credit" : "Payment")}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {smartDate(e.entry_date)} · bal{" "}
                          {formatPKR(e.running_balance)}
                        </p>
                      </div>
                      <span
                        className={`text-sm font-semibold tabular-nums ${
                          e.type === "credit"
                            ? "text-rose-600"
                            : "text-emerald-600"
                        }`}
                      >
                        {e.type === "credit" ? "+" : "−"}
                        {formatPKR(e.amount)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        ) : null}
      </SheetContent>
    </Sheet>
  );
}

"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Loader2, Wallet } from "lucide-react";
import { toast } from "sonner";

import { createClient } from "@/lib/supabase/client";
import { formatPKR } from "@/lib/utils";
import { smartDate } from "@/lib/format";
import type { UdhaarType } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";
import { EmptyState } from "@/components/empty-state";

export type UdhaarRow = {
  retailer_id: string;
  shop_name: string;
  balance: number;
  credit_limit: number;
};

export function UdhaarManager({
  initialRows,
  wholesalerId,
}: {
  initialRows: UdhaarRow[];
  wholesalerId: string;
}) {
  const router = useRouter();
  const [rows] = React.useState(initialRows);
  const [entryFor, setEntryFor] = React.useState<{
    row: UdhaarRow;
    type: UdhaarType;
  } | null>(null);
  const [ledgerFor, setLedgerFor] = React.useState<UdhaarRow | null>(null);

  const totalOutstanding = rows.reduce(
    (sum, r) => sum + Math.max(r.balance, 0),
    0,
  );

  return (
    <div>
      <Card className="mb-5 flex items-center justify-between p-5">
        <div>
          <p className="text-sm font-medium text-muted-foreground">
            Total outstanding udhaar
          </p>
          <p className="mt-1 font-heading text-2xl font-bold tabular-nums text-rose-600">
            {formatPKR(totalOutstanding)}
          </p>
        </div>
        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-rose-100 text-rose-700">
          <Wallet className="h-5 w-5" />
        </span>
      </Card>

      {rows.length === 0 ? (
        <EmptyState
          icon={Wallet}
          title="No retailers yet"
          description="Once you link retailers and they order, their udhaar balances show up here."
        />
      ) : (
        <Card className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Retailer</TableHead>
                <TableHead>Credit limit</TableHead>
                <TableHead>Balance</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((row) => (
                <TableRow key={row.retailer_id}>
                  <TableCell className="font-medium">
                    {row.shop_name}
                  </TableCell>
                  <TableCell className="tabular-nums">
                    {formatPKR(row.credit_limit)}
                  </TableCell>
                  <TableCell className="tabular-nums">
                    <span
                      className={
                        row.balance > 0 ? "text-rose-600" : "text-emerald-600"
                      }
                    >
                      {formatPKR(row.balance)}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setLedgerFor(row)}
                      >
                        Ledger
                      </Button>
                      <Button
                        size="sm"
                        onClick={() =>
                          setEntryFor({ row, type: "payment" })
                        }
                      >
                        Record payment
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}

      <EntryDialog
        entry={entryFor}
        wholesalerId={wholesalerId}
        onOpenChange={(o) => !o && setEntryFor(null)}
        onSaved={() => {
          setEntryFor(null);
          router.refresh();
        }}
        onSwitchType={(type) =>
          setEntryFor((e) => (e ? { ...e, type } : e))
        }
      />

      <LedgerSheet
        row={ledgerFor}
        onOpenChange={(o) => !o && setLedgerFor(null)}
      />
    </div>
  );
}

function EntryDialog({
  entry,
  wholesalerId,
  onOpenChange,
  onSaved,
  onSwitchType,
}: {
  entry: { row: UdhaarRow; type: UdhaarType } | null;
  wholesalerId: string;
  onOpenChange: (o: boolean) => void;
  onSaved: () => void;
  onSwitchType: (type: UdhaarType) => void;
}) {
  const supabase = React.useMemo(() => createClient(), []);
  const [amount, setAmount] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [saving, setSaving] = React.useState(false);

  React.useEffect(() => {
    if (!entry) {
      setAmount("");
      setDescription("");
    }
  }, [entry]);

  async function save() {
    if (!entry) return;
    const amt = Number(amount);
    if (Number.isNaN(amt) || amt <= 0) {
      toast.error("Enter a valid amount");
      return;
    }
    setSaving(true);
    const delta = entry.type === "credit" ? amt : -amt;
    const running = entry.row.balance + delta;

    const { error } = await supabase.from("udhaar").insert({
      wholesaler_id: wholesalerId,
      retailer_id: entry.row.retailer_id,
      amount: amt,
      type: entry.type,
      description: description.trim() || null,
      running_balance: running,
    });
    setSaving(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success(
      entry.type === "payment" ? "Payment recorded" : "Credit added",
    );
    onSaved();
  }

  return (
    <Dialog open={!!entry} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Record ledger entry</DialogTitle>
          <DialogDescription>
            {entry?.row.shop_name} · current balance{" "}
            {formatPKR(entry?.row.balance ?? 0)}
          </DialogDescription>
        </DialogHeader>

        <Tabs
          value={entry?.type ?? "payment"}
          onValueChange={(v) => onSwitchType(v as UdhaarType)}
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="payment">Payment received</TabsTrigger>
            <TabsTrigger value="credit">Add credit (udhaar)</TabsTrigger>
          </TabsList>
          <TabsContent value="payment" />
          <TabsContent value="credit" />
        </Tabs>

        <div className="space-y-3">
          <div className="space-y-1.5">
            <Label htmlFor="amount">Amount (PKR)</Label>
            <Input
              id="amount"
              inputMode="numeric"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="5000"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="desc">Description (optional)</Label>
            <Input
              id="desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={
                entry?.type === "payment"
                  ? "Cash received"
                  : "Goods on credit"
              }
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={save} disabled={saving}>
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            Save entry
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function LedgerSheet({
  row,
  onOpenChange,
}: {
  row: UdhaarRow | null;
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
        .eq("retailer_id", row.retailer_id)
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
              <SheetTitle>{row.shop_name}</SheetTitle>
              <SheetDescription>Full udhaar transaction history</SheetDescription>
            </SheetHeader>
            <div className="flex-1 p-6">
              {entries === null ? (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" /> Loading…
                </div>
              ) : entries.length === 0 ? (
                <EmptyState
                  icon={Wallet}
                  title="No transactions yet"
                  description="Recorded credits and payments will appear here."
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

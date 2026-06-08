"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  Loader2,
  Plus,
  Search,
  Store,
  UserPlus,
  Users,
} from "lucide-react";
import { toast } from "sonner";

import { createClient } from "@/lib/supabase/client";
import { formatPKR } from "@/lib/utils";
import { smartDate } from "@/lib/format";
import type { LinkStatus, OrderStatus, UdhaarType } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { LinkStatusBadge, OrderStatusBadge } from "@/components/status-badge";
import { EmptyState } from "@/components/empty-state";

export type RetailerRow = {
  link_id: string;
  retailer_id: string;
  shop_name: string;
  city: string | null;
  full_name: string | null;
  phone: string | null;
  credit_limit: number;
  status: LinkStatus;
  balance: number;
};

type FoundRetailer = {
  retailer_id: string;
  full_name: string;
  shop_name: string;
  city: string | null;
  phone: string;
};

export function RetailersManager({
  initialRows,
  wholesalerId,
}: {
  initialRows: RetailerRow[];
  wholesalerId: string;
}) {
  const router = useRouter();
  const supabase = React.useMemo(() => createClient(), []);

  const [rows, setRows] = React.useState<RetailerRow[]>(initialRows);
  const [search, setSearch] = React.useState("");
  const [addOpen, setAddOpen] = React.useState(false);
  const [selected, setSelected] = React.useState<RetailerRow | null>(null);

  React.useEffect(() => setRows(initialRows), [initialRows]);

  const filtered = rows.filter((r) =>
    `${r.shop_name} ${r.full_name ?? ""} ${r.city ?? ""}`
      .toLowerCase()
      .includes(search.trim().toLowerCase()),
  );

  async function toggleStatus(row: RetailerRow, active: boolean) {
    const next: LinkStatus = active ? "active" : "blocked";
    setRows((list) =>
      list.map((r) =>
        r.link_id === row.link_id ? { ...r, status: next } : r,
      ),
    );
    const { error } = await supabase
      .from("wholesaler_retailer")
      .update({ status: next })
      .eq("id", row.link_id);
    if (error) {
      setRows((list) =>
        list.map((r) =>
          r.link_id === row.link_id ? { ...r, status: row.status } : r,
        ),
      );
      toast.error("Could not update status");
    } else {
      toast.success(active ? "Retailer activated" : "Retailer blocked");
    }
  }

  return (
    <div>
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search retailers…"
            className="pl-9"
          />
        </div>
        <Button onClick={() => setAddOpen(true)}>
          <Plus className="h-4 w-4" /> Add retailer
        </Button>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={Users}
          title={
            rows.length === 0 ? "No retailers linked yet" : "No matches found"
          }
          description={
            rows.length === 0
              ? "Add a retailer by their phone number to start receiving their orders."
              : "Try a different search."
          }
          action={
            rows.length === 0 ? (
              <Button onClick={() => setAddOpen(true)}>
                <UserPlus className="h-4 w-4" /> Add retailer
              </Button>
            ) : undefined
          }
        />
      ) : (
        <Card className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Shop</TableHead>
                <TableHead>City</TableHead>
                <TableHead>Credit limit</TableHead>
                <TableHead>Outstanding udhaar</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Active</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((row) => (
                <TableRow
                  key={row.link_id}
                  className="cursor-pointer"
                  onClick={() => setSelected(row)}
                >
                  <TableCell>
                    <p className="font-medium">{row.shop_name}</p>
                    <p className="text-xs text-muted-foreground">
                      {row.full_name} · {row.phone}
                    </p>
                  </TableCell>
                  <TableCell>{row.city ?? "—"}</TableCell>
                  <TableCell className="tabular-nums">
                    {formatPKR(row.credit_limit)}
                  </TableCell>
                  <TableCell className="font-medium tabular-nums">
                    <span
                      className={
                        row.balance > 0 ? "text-rose-600" : "text-emerald-600"
                      }
                    >
                      {formatPKR(row.balance)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <LinkStatusBadge status={row.status} />
                  </TableCell>
                  <TableCell
                    className="text-right"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Switch
                      checked={row.status === "active"}
                      onCheckedChange={(v) => toggleStatus(row, v)}
                      aria-label="Toggle active"
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}

      <AddRetailerDialog
        open={addOpen}
        onOpenChange={setAddOpen}
        wholesalerId={wholesalerId}
        existingIds={rows.map((r) => r.retailer_id)}
        onAdded={() => {
          setAddOpen(false);
          router.refresh();
        }}
      />

      <RetailerDetailSheet
        row={selected}
        onOpenChange={(o) => !o && setSelected(null)}
      />
    </div>
  );
}

function AddRetailerDialog({
  open,
  onOpenChange,
  wholesalerId,
  existingIds,
  onAdded,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  wholesalerId: string;
  existingIds: string[];
  onAdded: () => void;
}) {
  const supabase = React.useMemo(() => createClient(), []);
  const [phone, setPhone] = React.useState("");
  const [searching, setSearching] = React.useState(false);
  const [adding, setAdding] = React.useState(false);
  const [result, setResult] = React.useState<FoundRetailer | null>(null);
  const [searched, setSearched] = React.useState(false);
  const [creditLimit, setCreditLimit] = React.useState("");

  React.useEffect(() => {
    if (!open) {
      setPhone("");
      setResult(null);
      setSearched(false);
      setCreditLimit("");
    }
  }, [open]);

  async function onSearch(ev: React.FormEvent) {
    ev.preventDefault();
    if (!phone.trim()) return;
    setSearching(true);
    setSearched(false);
    const { data, error } = await supabase.rpc("find_retailer_by_phone", {
      p_phone: phone.trim(),
    });
    setSearching(false);
    setSearched(true);
    if (error) {
      toast.error(error.message);
      return;
    }
    setResult((data?.[0] as FoundRetailer) ?? null);
  }

  async function addRetailer() {
    if (!result) return;
    if (existingIds.includes(result.retailer_id)) {
      toast.error("This retailer is already linked");
      return;
    }
    setAdding(true);
    const limit = Number(creditLimit) || 0;
    const { error } = await supabase.from("wholesaler_retailer").insert({
      wholesaler_id: wholesalerId,
      retailer_id: result.retailer_id,
      status: "active",
      credit_limit: limit,
    });
    setAdding(false);
    if (error) {
      toast.error(
        error.code === "23505"
          ? "This retailer is already linked"
          : error.message,
      );
      return;
    }
    toast.success(`${result.shop_name} added`);
    onAdded();
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add a retailer</DialogTitle>
          <DialogDescription>
            Search by the shopkeeper&apos;s registered phone number.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={onSearch} className="flex gap-2">
          <Input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="03001234567"
            inputMode="tel"
          />
          <Button type="submit" disabled={searching}>
            {searching ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Search className="h-4 w-4" />
            )}
            Search
          </Button>
        </form>

        {searched && !result ? (
          <p className="rounded-lg bg-muted/50 p-3 text-sm text-muted-foreground">
            No retailer found with that phone number. Ask them to sign up
            first.
          </p>
        ) : null}

        {result ? (
          <div className="space-y-3 rounded-lg border p-4">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Store className="h-5 w-5" />
              </span>
              <div>
                <p className="font-medium">{result.shop_name}</p>
                <p className="text-xs text-muted-foreground">
                  {result.full_name} · {result.city ?? "—"}
                </p>
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="credit">Credit limit (PKR, optional)</Label>
              <Input
                id="credit"
                inputMode="numeric"
                value={creditLimit}
                onChange={(e) => setCreditLimit(e.target.value)}
                placeholder="0"
              />
            </div>
          </div>
        ) : null}

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={addRetailer} disabled={!result || adding}>
            {adding ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            Add retailer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function RetailerDetailSheet({
  row,
  onOpenChange,
}: {
  row: RetailerRow | null;
  onOpenChange: (o: boolean) => void;
}) {
  const supabase = React.useMemo(() => createClient(), []);
  const [orders, setOrders] = React.useState<
    | {
        id: string;
        order_number: string;
        total: number;
        status: OrderStatus;
        created_at: string;
      }[]
    | null
  >(null);
  const [ledger, setLedger] = React.useState<
    | {
        id: string;
        description: string | null;
        amount: number;
        type: UdhaarType;
        entry_date: string;
      }[]
    | null
  >(null);

  React.useEffect(() => {
    if (!row) return;
    setOrders(null);
    setLedger(null);
    (async () => {
      const [{ data: o }, { data: l }] = await Promise.all([
        supabase
          .from("orders")
          .select("id, order_number, total, status, created_at")
          .eq("retailer_id", row.retailer_id)
          .order("created_at", { ascending: false })
          .limit(10),
        supabase
          .from("udhaar")
          .select("id, description, amount, type, entry_date")
          .eq("retailer_id", row.retailer_id)
          .order("entry_date", { ascending: false })
          .limit(10),
      ]);
      setOrders(
        (o ?? []).map((x) => ({ ...x, total: Number(x.total) })),
      );
      setLedger(
        (l ?? []).map((x) => ({ ...x, amount: Number(x.amount) })),
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
              <SheetDescription>
                {row.full_name} · {row.phone} · {row.city ?? "—"}
              </SheetDescription>
            </SheetHeader>

            <div className="flex-1 space-y-6 p-6">
              <div className="flex items-center justify-between rounded-lg bg-muted/50 p-3">
                <span className="text-sm font-medium">Outstanding udhaar</span>
                <span
                  className={`font-heading text-lg font-bold tabular-nums ${
                    row.balance > 0 ? "text-rose-600" : "text-emerald-600"
                  }`}
                >
                  {formatPKR(row.balance)}
                </span>
              </div>

              <Section title="Recent orders">
                {orders === null ? (
                  <LoadingLine />
                ) : orders.length === 0 ? (
                  <Muted>No orders yet.</Muted>
                ) : (
                  <div className="divide-y rounded-lg border">
                    {orders.map((o) => (
                      <div
                        key={o.id}
                        className="flex items-center justify-between p-3"
                      >
                        <div>
                          <p className="text-sm font-medium">
                            {o.order_number}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {smartDate(o.created_at)}
                          </p>
                        </div>
                        <div className="flex items-center gap-3">
                          <OrderStatusBadge status={o.status} />
                          <span className="text-sm font-semibold tabular-nums">
                            {formatPKR(o.total)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </Section>

              <Section title="Udhaar ledger">
                {ledger === null ? (
                  <LoadingLine />
                ) : ledger.length === 0 ? (
                  <Muted>No ledger entries yet.</Muted>
                ) : (
                  <div className="divide-y rounded-lg border">
                    {ledger.map((l) => (
                      <div
                        key={l.id}
                        className="flex items-center justify-between p-3"
                      >
                        <div>
                          <p className="text-sm font-medium">
                            {l.description ??
                              (l.type === "credit" ? "Credit" : "Payment")}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {smartDate(l.entry_date)}
                          </p>
                        </div>
                        <span
                          className={`text-sm font-semibold tabular-nums ${
                            l.type === "credit"
                              ? "text-rose-600"
                              : "text-emerald-600"
                          }`}
                        >
                          {l.type === "credit" ? "+" : "−"}
                          {formatPKR(l.amount)}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </Section>
            </div>
          </>
        ) : null}
      </SheetContent>
    </Sheet>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <p className="mb-2 text-sm font-semibold">{title}</p>
      {children}
    </div>
  );
}

function LoadingLine() {
  return (
    <div className="flex items-center gap-2 text-sm text-muted-foreground">
      <Loader2 className="h-4 w-4 animate-spin" /> Loading…
    </div>
  );
}

function Muted({ children }: { children: React.ReactNode }) {
  return (
    <p className="rounded-lg bg-muted/40 p-3 text-sm text-muted-foreground">
      {children}
    </p>
  );
}

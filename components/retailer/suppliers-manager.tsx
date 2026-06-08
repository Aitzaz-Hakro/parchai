"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Loader2,
  Plus,
  Search,
  Store,
} from "lucide-react";
import { toast } from "sonner";

import { createClient } from "@/lib/supabase/client";
import { formatPKR } from "@/lib/utils";
import type { LinkStatus } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { LinkStatusBadge } from "@/components/status-badge";
import { EmptyState } from "@/components/empty-state";

export type SupplierRow = {
  link_id: string;
  wholesaler_id: string;
  business_name: string;
  city: string | null;
  status: LinkStatus;
  balance: number;
};

type FoundWholesaler = {
  wholesaler_id: string;
  full_name: string;
  business_name: string;
  city: string | null;
  phone: string;
};

export function SuppliersManager({
  initialRows,
  retailerId,
}: {
  initialRows: SupplierRow[];
  retailerId: string;
}) {
  const router = useRouter();
  const [rows] = React.useState(initialRows);
  const [addOpen, setAddOpen] = React.useState(false);

  return (
    <div>
      <div className="mb-5 flex justify-end">
        <Button onClick={() => setAddOpen(true)}>
          <Plus className="h-4 w-4" /> Add supplier
        </Button>
      </div>

      {rows.length === 0 ? (
        <EmptyState
          icon={Store}
          title="No suppliers yet"
          description="Add your supplier by their phone number to browse their catalogue and place orders."
          action={
            <Button onClick={() => setAddOpen(true)}>
              <Plus className="h-4 w-4" /> Add supplier
            </Button>
          }
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {rows.map((row) => (
            <Card key={row.link_id} className="flex flex-col p-5">
              <div className="flex items-start justify-between">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Store className="h-5 w-5" />
                </span>
                <LinkStatusBadge status={row.status} />
              </div>
              <p className="mt-3 font-semibold">{row.business_name}</p>
              <p className="text-xs text-muted-foreground">
                {row.city ?? "—"}
              </p>
              <div className="mt-3 flex items-center justify-between rounded-lg bg-muted/50 px-3 py-2">
                <span className="text-xs text-muted-foreground">Udhaar</span>
                <span
                  className={`text-sm font-semibold tabular-nums ${
                    row.balance > 0 ? "text-rose-600" : "text-emerald-600"
                  }`}
                >
                  {formatPKR(row.balance)}
                </span>
              </div>
              <Button
                asChild
                className="mt-4 w-full"
                disabled={row.status !== "active"}
                variant={row.status === "active" ? "default" : "outline"}
              >
                {row.status === "active" ? (
                  <Link href={`/retailer/suppliers/${row.wholesaler_id}`}>
                    Browse catalogue <ArrowRight className="h-4 w-4" />
                  </Link>
                ) : (
                  <span>Awaiting approval</span>
                )}
              </Button>
            </Card>
          ))}
        </div>
      )}

      <AddSupplierDialog
        open={addOpen}
        onOpenChange={setAddOpen}
        retailerId={retailerId}
        existingIds={rows.map((r) => r.wholesaler_id)}
        onAdded={() => {
          setAddOpen(false);
          router.refresh();
        }}
      />
    </div>
  );
}

function AddSupplierDialog({
  open,
  onOpenChange,
  retailerId,
  existingIds,
  onAdded,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  retailerId: string;
  existingIds: string[];
  onAdded: () => void;
}) {
  const supabase = React.useMemo(() => createClient(), []);
  const [phone, setPhone] = React.useState("");
  const [searching, setSearching] = React.useState(false);
  const [adding, setAdding] = React.useState(false);
  const [result, setResult] = React.useState<FoundWholesaler | null>(null);
  const [searched, setSearched] = React.useState(false);

  React.useEffect(() => {
    if (!open) {
      setPhone("");
      setResult(null);
      setSearched(false);
    }
  }, [open]);

  async function onSearch(ev: React.FormEvent) {
    ev.preventDefault();
    if (!phone.trim()) return;
    setSearching(true);
    setSearched(false);
    const { data, error } = await supabase.rpc("find_wholesaler_by_phone", {
      p_phone: phone.trim(),
    });
    setSearching(false);
    setSearched(true);
    if (error) {
      toast.error(error.message);
      return;
    }
    setResult((data?.[0] as FoundWholesaler) ?? null);
  }

  async function addSupplier() {
    if (!result) return;
    if (existingIds.includes(result.wholesaler_id)) {
      toast.error("This supplier is already added");
      return;
    }
    setAdding(true);
    const { error } = await supabase.from("wholesaler_retailer").insert({
      wholesaler_id: result.wholesaler_id,
      retailer_id: retailerId,
      status: "active",
    });
    setAdding(false);
    if (error) {
      toast.error(
        error.code === "23505"
          ? "This supplier is already added"
          : error.message,
      );
      return;
    }
    toast.success(`${result.business_name} added`);
    onAdded();
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add a supplier</DialogTitle>
          <DialogDescription>
            Search by your supplier&apos;s registered phone number.
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
            No supplier found with that phone number.
          </p>
        ) : null}

        {result ? (
          <div className="flex items-center gap-3 rounded-lg border p-4">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Store className="h-5 w-5" />
            </span>
            <div>
              <p className="font-medium">{result.business_name}</p>
              <p className="text-xs text-muted-foreground">
                {result.full_name} · {result.city ?? "—"}
              </p>
            </div>
          </div>
        ) : null}

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={addSupplier} disabled={!result || adding}>
            {adding ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            Add supplier
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

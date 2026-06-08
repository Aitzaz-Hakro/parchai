"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Boxes,
  Check,
  Loader2,
  Plus,
  Search,
  ShoppingCart,
} from "lucide-react";
import { toast } from "sonner";

import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { EmptyState } from "@/components/empty-state";

export type StockItem = {
  id: string;
  name: string;
  wholesaler_id: string | null;
};

type ProductHit = {
  id: string;
  name: string;
  wholesaler_id: string;
  business_name: string;
};

export function StockTracker({
  initialItems,
  retailerId,
}: {
  initialItems: StockItem[];
  retailerId: string;
}) {
  const router = useRouter();
  const supabase = React.useMemo(() => createClient(), []);
  const [items, setItems] = React.useState(initialItems);
  const [addOpen, setAddOpen] = React.useState(false);

  React.useEffect(() => setItems(initialItems), [initialItems]);

  async function markRestocked(id: string) {
    setItems((list) => list.filter((i) => i.id !== id));
    const { error } = await supabase
      .from("stock_tracker")
      .update({ status: "restocked" })
      .eq("id", id);
    if (error) {
      toast.error("Could not update");
      router.refresh();
    } else {
      toast.success("Marked as restocked");
    }
  }

  return (
    <div>
      <div className="mb-5 flex justify-end">
        <Button onClick={() => setAddOpen(true)}>
          <Plus className="h-4 w-4" /> Mark sold out
        </Button>
      </div>

      {items.length === 0 ? (
        <EmptyState
          icon={Boxes}
          title="Nothing marked sold out"
          description="When you run out of a product, mark it here so you remember to reorder."
          action={
            <Button onClick={() => setAddOpen(true)}>
              <Plus className="h-4 w-4" /> Mark sold out
            </Button>
          }
        />
      ) : (
        <Card className="divide-y">
          {items.map((item) => (
            <div key={item.id} className="flex items-center gap-3 p-4">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-rose-100 text-rose-700">
                <Boxes className="h-5 w-5" />
              </span>
              <p className="flex-1 font-medium">{item.name}</p>
              {item.wholesaler_id ? (
                <Button asChild size="sm" variant="outline">
                  <Link href={`/retailer/suppliers/${item.wholesaler_id}`}>
                    <ShoppingCart className="h-3.5 w-3.5" /> Order now
                  </Link>
                </Button>
              ) : null}
              <Button
                size="sm"
                variant="ghost"
                onClick={() => markRestocked(item.id)}
              >
                <Check className="h-3.5 w-3.5" /> Restocked
              </Button>
            </div>
          ))}
        </Card>
      )}

      <MarkSoldOutDialog
        open={addOpen}
        onOpenChange={setAddOpen}
        retailerId={retailerId}
        onSaved={() => {
          setAddOpen(false);
          router.refresh();
        }}
      />
    </div>
  );
}

function MarkSoldOutDialog({
  open,
  onOpenChange,
  retailerId,
  onSaved,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  retailerId: string;
  onSaved: () => void;
}) {
  const supabase = React.useMemo(() => createClient(), []);
  const [query, setQuery] = React.useState("");
  const [hits, setHits] = React.useState<ProductHit[]>([]);
  const [searching, setSearching] = React.useState(false);
  const [custom, setCustom] = React.useState("");
  const [saving, setSaving] = React.useState(false);

  React.useEffect(() => {
    if (!open) {
      setQuery("");
      setHits([]);
      setCustom("");
    }
  }, [open]);

  React.useEffect(() => {
    if (query.trim().length < 2) {
      setHits([]);
      return;
    }
    let active = true;
    setSearching(true);
    const t = setTimeout(async () => {
      const { data } = await supabase
        .from("products")
        .select("id, name, wholesaler_id, wholesalers(business_name)")
        .ilike("name", `%${query.trim()}%`)
        .limit(8);
      if (!active) return;
      setHits(
        (data ?? []).map((p) => ({
          id: p.id,
          name: p.name,
          wholesaler_id: p.wholesaler_id,
          business_name:
            (p.wholesalers as unknown as { business_name: string } | null)
              ?.business_name ?? "",
        })),
      );
      setSearching(false);
    }, 250);
    return () => {
      active = false;
      clearTimeout(t);
    };
  }, [query, supabase]);

  async function markProduct(hit: ProductHit) {
    setSaving(true);
    const { error } = await supabase.from("stock_tracker").insert({
      retailer_id: retailerId,
      product_id: hit.id,
      status: "sold_out",
    });
    setSaving(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success(`${hit.name} marked sold out`);
    onSaved();
  }

  async function markCustom() {
    if (!custom.trim()) return;
    setSaving(true);
    const { error } = await supabase.from("stock_tracker").insert({
      retailer_id: retailerId,
      custom_item_name: custom.trim(),
      status: "sold_out",
    });
    setSaving(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Item marked sold out");
    onSaved();
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Mark item as sold out</DialogTitle>
          <DialogDescription>
            Search your suppliers&apos; products or add a custom item.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="existing">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="existing">From suppliers</TabsTrigger>
            <TabsTrigger value="custom">Custom item</TabsTrigger>
          </TabsList>

          <TabsContent value="existing" className="space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search products…"
                className="pl-9"
              />
            </div>
            <div className="max-h-60 space-y-1 overflow-y-auto">
              {searching ? (
                <div className="flex items-center gap-2 p-2 text-sm text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" /> Searching…
                </div>
              ) : hits.length === 0 && query.trim().length >= 2 ? (
                <p className="p-2 text-sm text-muted-foreground">
                  No matching products.
                </p>
              ) : (
                hits.map((hit) => (
                  <button
                    key={hit.id}
                    disabled={saving}
                    onClick={() => markProduct(hit)}
                    className="flex w-full items-center justify-between rounded-lg border p-3 text-left transition-colors hover:bg-secondary"
                  >
                    <div>
                      <p className="text-sm font-medium">{hit.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {hit.business_name}
                      </p>
                    </div>
                    <Plus className="h-4 w-4 text-muted-foreground" />
                  </button>
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="custom" className="space-y-3">
            <div className="space-y-1.5">
              <Label htmlFor="custom">Item name</Label>
              <Input
                id="custom"
                value={custom}
                onChange={(e) => setCustom(e.target.value)}
                placeholder="e.g. Loose dhania"
              />
            </div>
            <DialogFooter>
              <Button onClick={markCustom} disabled={saving || !custom.trim()}>
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                Mark sold out
              </Button>
            </DialogFooter>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

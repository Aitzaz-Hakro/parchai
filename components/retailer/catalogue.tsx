"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Loader2, Minus, Package, Plus, Search, ShoppingCart } from "lucide-react";
import { toast } from "sonner";

import { createClient } from "@/lib/supabase/client";
import { cn, formatNumber, formatPKR } from "@/lib/utils";
import { useCartStore } from "@/lib/stores/cart-store";
import type { Product } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { EmptyState } from "@/components/empty-state";

export function Catalogue({
  wholesalerId,
  businessName,
  products,
}: {
  wholesalerId: string;
  businessName: string;
  products: Product[];
}) {
  const router = useRouter();
  const supabase = React.useMemo(() => createClient(), []);

  const { items, setSupplier, increment, decrement, clear } = useCartStore();
  const [search, setSearch] = React.useState("");
  const [category, setCategory] = React.useState("all");
  const [placing, setPlacing] = React.useState(false);

  React.useEffect(() => {
    setSupplier(wholesalerId);
  }, [wholesalerId, setSupplier]);

  const categories = React.useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => p.category && set.add(p.category));
    return [...set];
  }, [products]);

  const filtered = products.filter((p) => {
    const matchesSearch = p.name
      .toLowerCase()
      .includes(search.trim().toLowerCase());
    const matchesCategory = category === "all" || p.category === category;
    return matchesSearch && matchesCategory;
  });

  const cartItems = Object.values(items);
  const totalQty = cartItems.reduce((s, i) => s + i.quantity, 0);
  const totalPrice = cartItems.reduce((s, i) => s + i.quantity * i.price, 0);

  async function placeOrder() {
    if (cartItems.length === 0) return;
    setPlacing(true);
    const payload = cartItems.map((i) => ({
      product_id: i.productId,
      quantity: i.quantity,
    }));

    const { data, error } = await supabase.rpc("place_order", {
      p_wholesaler_id: wholesalerId,
      p_items: payload,
    });

    setPlacing(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    clear();
    toast.success("Order placed!", {
      description: `Your order to ${businessName} has been sent.`,
    });
    void data;
    router.push("/retailer/orders");
    router.refresh();
  }

  return (
    <div className="pb-20">
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products…"
            className="pl-9"
          />
        </div>
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="w-full sm:w-52">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All categories</SelectItem>
            {categories.map((c) => (
              <SelectItem key={c} value={c}>
                {c}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={Package}
          title="No products found"
          description="This supplier hasn't added matching products yet."
        />
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {filtered.map((product) => {
            const outOfStock = product.stock_qty <= 0;
            const qty = items[product.id]?.quantity ?? 0;
            return (
              <Card
                key={product.id}
                className={cn(
                  "flex flex-col overflow-hidden",
                  outOfStock && "opacity-60",
                )}
              >
                <div className="relative aspect-square w-full">
                  {product.image_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-muted text-muted-foreground">
                      <Package className="h-8 w-8" />
                    </div>
                  )}
                  {outOfStock ? (
                    <span className="absolute left-2 top-2">
                      <Badge variant="slate">Out of stock</Badge>
                    </span>
                  ) : null}
                </div>
                <div className="flex flex-1 flex-col p-3">
                  <p className="line-clamp-2 text-sm font-medium leading-tight">
                    {product.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    per {product.unit}
                  </p>
                  <p className="mt-1 font-heading text-base font-bold tabular-nums">
                    {formatPKR(product.price)}
                  </p>

                  <div className="mt-3">
                    {qty === 0 ? (
                      <Button
                        size="sm"
                        className="w-full"
                        disabled={outOfStock}
                        onClick={() =>
                          increment({
                            productId: product.id,
                            name: product.name,
                            price: Number(product.price),
                            unit: product.unit,
                          })
                        }
                      >
                        <Plus className="h-3.5 w-3.5" /> Add
                      </Button>
                    ) : (
                      <div className="flex items-center justify-between rounded-md border">
                        <button
                          className="flex h-9 w-9 items-center justify-center text-foreground"
                          onClick={() => decrement(product.id)}
                          aria-label="Decrease"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="text-sm font-semibold tabular-nums">
                          {qty}
                        </span>
                        <button
                          className="flex h-9 w-9 items-center justify-center text-foreground"
                          onClick={() =>
                            increment({
                              productId: product.id,
                              name: product.name,
                              price: Number(product.price),
                              unit: product.unit,
                            })
                          }
                          aria-label="Increase"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Sticky order bar */}
      {totalQty > 0 ? (
        <div className="fixed inset-x-0 bottom-0 z-30 border-t bg-background/95 px-4 py-3 backdrop-blur-md md:left-60">
          <div className="mx-auto flex max-w-5xl items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                <ShoppingCart className="h-5 w-5" />
              </span>
              <div>
                <p className="text-sm font-semibold tabular-nums">
                  {formatNumber(totalQty)}{" "}
                  {totalQty === 1 ? "item" : "items"} ·{" "}
                  {formatPKR(totalPrice)}
                </p>
                <p className="text-xs text-muted-foreground">{businessName}</p>
              </div>
            </div>
            <Button onClick={placeOrder} disabled={placing} size="lg">
              {placing ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Placing…
                </>
              ) : (
                "Place order"
              )}
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

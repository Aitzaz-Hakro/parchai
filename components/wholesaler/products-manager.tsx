"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  Boxes,
  LayoutGrid,
  List,
  Loader2,
  Package,
  Pencil,
  Plus,
  Search,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";

import { createClient } from "@/lib/supabase/client";
import { cn, formatNumber, formatPKR } from "@/lib/utils";
import type { Product, ProductUnit } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { EmptyState } from "@/components/empty-state";

const CATEGORIES = [
  "Grains & Pulses",
  "Cooking Oil & Ghee",
  "Spices",
  "Beverages",
  "Snacks",
  "Dairy",
  "Cleaning",
  "Personal Care",
  "Bakery",
  "Other",
];

const UNITS: ProductUnit[] = ["piece", "kg", "dozen", "carton"];

type FormState = {
  name: string;
  category: string;
  unit: ProductUnit;
  price: string;
  stock_qty: string;
  image_url: string;
  is_active: boolean;
};

const EMPTY_FORM: FormState = {
  name: "",
  category: "Grains & Pulses",
  unit: "piece",
  price: "",
  stock_qty: "",
  image_url: "",
  is_active: true,
};

export function ProductsManager({
  initialProducts,
  wholesalerId,
}: {
  initialProducts: Product[];
  wholesalerId: string;
}) {
  const router = useRouter();
  const supabase = React.useMemo(() => createClient(), []);

  const [products, setProducts] = React.useState<Product[]>(initialProducts);
  const [view, setView] = React.useState<"grid" | "list">("grid");
  const [search, setSearch] = React.useState("");
  const [categoryFilter, setCategoryFilter] = React.useState<string>("all");

  const [sheetOpen, setSheetOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<Product | null>(null);
  const [form, setForm] = React.useState<FormState>(EMPTY_FORM);
  const [saving, setSaving] = React.useState(false);
  const [formError, setFormError] = React.useState<string>("");

  const [deleteTarget, setDeleteTarget] = React.useState<Product | null>(null);
  const [deleting, setDeleting] = React.useState(false);

  React.useEffect(() => {
    setProducts(initialProducts);
  }, [initialProducts]);

  const filtered = products.filter((p) => {
    const matchesSearch = p.name
      .toLowerCase()
      .includes(search.trim().toLowerCase());
    const matchesCategory =
      categoryFilter === "all" || p.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  function openCreate() {
    setEditing(null);
    setForm(EMPTY_FORM);
    setFormError("");
    setSheetOpen(true);
  }

  function openEdit(product: Product) {
    setEditing(product);
    setForm({
      name: product.name,
      category: product.category ?? "Other",
      unit: product.unit,
      price: String(product.price),
      stock_qty: String(product.stock_qty),
      image_url: product.image_url ?? "",
      is_active: product.is_active,
    });
    setFormError("");
    setSheetOpen(true);
  }

  async function saveProduct(ev: React.FormEvent) {
    ev.preventDefault();
    if (!form.name.trim()) {
      setFormError("Product name is required");
      return;
    }
    const price = Number(form.price);
    const stock = Number(form.stock_qty);
    if (Number.isNaN(price) || price < 0) {
      setFormError("Enter a valid price");
      return;
    }
    if (Number.isNaN(stock) || stock < 0) {
      setFormError("Enter a valid stock quantity");
      return;
    }

    setSaving(true);
    const payload = {
      name: form.name.trim(),
      category: form.category,
      unit: form.unit,
      price,
      stock_qty: Math.round(stock),
      image_url: form.image_url.trim() || null,
      is_active: form.is_active,
    };

    if (editing) {
      const { error } = await supabase
        .from("products")
        .update(payload)
        .eq("id", editing.id);
      setSaving(false);
      if (error) {
        toast.error(error.message);
        return;
      }
      toast.success("Product updated");
    } else {
      const { error } = await supabase
        .from("products")
        .insert({ ...payload, wholesaler_id: wholesalerId });
      setSaving(false);
      if (error) {
        toast.error(error.message);
        return;
      }
      toast.success("Product added");
    }

    setSheetOpen(false);
    router.refresh();
  }

  async function toggleActive(product: Product, next: boolean) {
    setProducts((prev) =>
      prev.map((p) => (p.id === product.id ? { ...p, is_active: next } : p)),
    );
    const { error } = await supabase
      .from("products")
      .update({ is_active: next })
      .eq("id", product.id);
    if (error) {
      setProducts((prev) =>
        prev.map((p) =>
          p.id === product.id ? { ...p, is_active: !next } : p,
        ),
      );
      toast.error("Could not update status");
    } else {
      toast.success(next ? "Product activated" : "Product deactivated");
    }
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    const { error } = await supabase
      .from("products")
      .delete()
      .eq("id", deleteTarget.id);
    setDeleting(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Product deleted");
    setDeleteTarget(null);
    router.refresh();
  }

  return (
    <div>
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
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-full sm:w-52">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All categories</SelectItem>
            {CATEGORIES.map((c) => (
              <SelectItem key={c} value={c}>
                {c}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="hidden items-center rounded-md border p-0.5 sm:flex">
          <button
            onClick={() => setView("grid")}
            className={cn(
              "flex h-8 w-8 items-center justify-center rounded",
              view === "grid"
                ? "bg-secondary text-foreground"
                : "text-muted-foreground",
            )}
            aria-label="Grid view"
          >
            <LayoutGrid className="h-4 w-4" />
          </button>
          <button
            onClick={() => setView("list")}
            className={cn(
              "flex h-8 w-8 items-center justify-center rounded",
              view === "list"
                ? "bg-secondary text-foreground"
                : "text-muted-foreground",
            )}
            aria-label="List view"
          >
            <List className="h-4 w-4" />
          </button>
        </div>
        <Button onClick={openCreate}>
          <Plus className="h-4 w-4" /> Add product
        </Button>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={Boxes}
          title={
            products.length === 0
              ? "No products yet"
              : "No products match your filters"
          }
          description={
            products.length === 0
              ? "Add your first product so retailers can start ordering."
              : "Try a different search or category."
          }
          action={
            products.length === 0 ? (
              <Button onClick={openCreate}>
                <Plus className="h-4 w-4" /> Add product
              </Button>
            ) : undefined
          }
        />
      ) : view === "grid" ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onEdit={() => openEdit(product)}
              onDelete={() => setDeleteTarget(product)}
              onToggle={(v) => toggleActive(product, v)}
            />
          ))}
        </div>
      ) : (
        <Card className="divide-y">
          {filtered.map((product) => (
            <ProductRow
              key={product.id}
              product={product}
              onEdit={() => openEdit(product)}
              onDelete={() => setDeleteTarget(product)}
              onToggle={(v) => toggleActive(product, v)}
            />
          ))}
        </Card>
      )}

      {/* Add / Edit slide-over */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>
              {editing ? "Edit product" : "Add product"}
            </SheetTitle>
            <SheetDescription>
              {editing
                ? "Update the details for this product."
                : "Add a new product to your catalogue."}
            </SheetDescription>
          </SheetHeader>

          <form
            id="product-form"
            onSubmit={saveProduct}
            className="flex-1 space-y-4 p-6"
          >
            <div className="space-y-1.5">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={form.name}
                onChange={(e) => {
                  setForm((f) => ({ ...f, name: e.target.value }));
                  setFormError("");
                }}
                placeholder="Sugar 1kg"
              />
            </div>

            <div className="space-y-1.5">
              <Label>Category</Label>
              <Select
                value={form.category}
                onValueChange={(v) => setForm((f) => ({ ...f, category: v }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Unit</Label>
                <Select
                  value={form.unit}
                  onValueChange={(v) =>
                    setForm((f) => ({ ...f, unit: v as ProductUnit }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {UNITS.map((u) => (
                      <SelectItem key={u} value={u} className="capitalize">
                        {u}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="price">Price (PKR)</Label>
                <Input
                  id="price"
                  inputMode="decimal"
                  value={form.price}
                  onChange={(e) => {
                    setForm((f) => ({ ...f, price: e.target.value }));
                    setFormError("");
                  }}
                  placeholder="250"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="stock">Stock quantity</Label>
                <Input
                  id="stock"
                  inputMode="numeric"
                  value={form.stock_qty}
                  onChange={(e) => {
                    setForm((f) => ({ ...f, stock_qty: e.target.value }));
                    setFormError("");
                  }}
                  placeholder="100"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="image">Image URL (optional)</Label>
                <Input
                  id="image"
                  value={form.image_url}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, image_url: e.target.value }))
                  }
                  placeholder="https://…"
                />
              </div>
            </div>

            <div className="flex items-center justify-between rounded-lg border p-3">
              <div>
                <p className="text-sm font-medium">Active</p>
                <p className="text-xs text-muted-foreground">
                  Visible to retailers for ordering
                </p>
              </div>
              <Switch
                checked={form.is_active}
                onCheckedChange={(v) =>
                  setForm((f) => ({ ...f, is_active: v }))
                }
              />
            </div>

            {formError ? (
              <p className="text-sm text-destructive">{formError}</p>
            ) : null}
          </form>

          <SheetFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setSheetOpen(false)}
              disabled={saving}
            >
              Cancel
            </Button>
            <Button type="submit" form="product-form" disabled={saving}>
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Saving…
                </>
              ) : editing ? (
                "Save changes"
              ) : (
                "Add product"
              )}
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(o) => !o && setDeleteTarget(null)}
        title="Delete product?"
        description={`"${deleteTarget?.name}" will be permanently removed from your catalogue.`}
        confirmLabel="Delete"
        destructive
        loading={deleting}
        onConfirm={confirmDelete}
      />
    </div>
  );
}

function ProductImage({
  product,
  className,
}: {
  product: Product;
  className?: string;
}) {
  if (product.image_url) {
    // eslint-disable-next-line @next/next/no-img-element
    return (
      <img
        src={product.image_url}
        alt={product.name}
        className={cn("object-cover", className)}
      />
    );
  }
  return (
    <div
      className={cn(
        "flex items-center justify-center bg-muted text-muted-foreground",
        className,
      )}
    >
      <Package className="h-8 w-8" />
    </div>
  );
}

function ProductCard({
  product,
  onEdit,
  onDelete,
  onToggle,
}: {
  product: Product;
  onEdit: () => void;
  onDelete: () => void;
  onToggle: (v: boolean) => void;
}) {
  return (
    <Card className="flex flex-col overflow-hidden">
      <div className="relative aspect-[4/3] w-full">
        <ProductImage product={product} className="h-full w-full" />
        {!product.is_active ? (
          <span className="absolute left-2 top-2">
            <Badge variant="slate">Inactive</Badge>
          </span>
        ) : null}
      </div>
      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="font-medium leading-tight">{product.name}</p>
            <p className="text-xs text-muted-foreground">{product.category}</p>
          </div>
          <Switch
            checked={product.is_active}
            onCheckedChange={onToggle}
            aria-label="Toggle active"
          />
        </div>
        <div className="mt-3 flex items-end justify-between">
          <div>
            <p className="font-heading text-lg font-bold tabular-nums">
              {formatPKR(product.price)}
            </p>
            <p className="text-xs text-muted-foreground">
              per {product.unit} · {formatNumber(product.stock_qty)} in stock
            </p>
          </div>
        </div>
        <div className="mt-4 flex gap-2 border-t pt-3">
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={onEdit}
          >
            <Pencil className="h-3.5 w-3.5" /> Edit
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-destructive hover:text-destructive"
            onClick={onDelete}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </Card>
  );
}

function ProductRow({
  product,
  onEdit,
  onDelete,
  onToggle,
}: {
  product: Product;
  onEdit: () => void;
  onDelete: () => void;
  onToggle: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center gap-4 p-4">
      <ProductImage
        product={product}
        className="h-14 w-14 shrink-0 rounded-lg"
      />
      <div className="min-w-0 flex-1">
        <p className="truncate font-medium">{product.name}</p>
        <p className="text-xs text-muted-foreground">
          {product.category} · per {product.unit}
        </p>
      </div>
      <div className="hidden text-right sm:block">
        <p className="font-semibold tabular-nums">
          {formatPKR(product.price)}
        </p>
        <p className="text-xs text-muted-foreground">
          {formatNumber(product.stock_qty)} in stock
        </p>
      </div>
      <Switch
        checked={product.is_active}
        onCheckedChange={onToggle}
        aria-label="Toggle active"
      />
      <div className="flex gap-1">
        <Button variant="ghost" size="icon" onClick={onEdit}>
          <Pencil className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="text-destructive hover:text-destructive"
          onClick={onDelete}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

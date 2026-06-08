"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { ClipboardList, Loader2, PackageCheck } from "lucide-react";
import { toast } from "sonner";

import { createClient } from "@/lib/supabase/client";
import { formatNumber, formatPKR } from "@/lib/utils";
import { fullDate, smartDate } from "@/lib/format";
import type { OrderItem, OrderStatus } from "@/lib/types";
import { Button } from "@/components/ui/button";
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
import { OrderStatusBadge } from "@/components/status-badge";
import { EmptyState } from "@/components/empty-state";

export type OrderRow = {
  id: string;
  order_number: string;
  shop_name: string;
  item_count: number;
  total: number;
  status: OrderStatus;
  created_at: string;
};

const STATUS_FILTERS: { value: string; label: string }[] = [
  { value: "all", label: "All orders" },
  { value: "pending", label: "Pending" },
  { value: "confirmed", label: "Confirmed" },
  { value: "dispatched", label: "Dispatched" },
  { value: "delivered", label: "Delivered" },
  { value: "cancelled", label: "Cancelled" },
];

// Allowed next actions per status.
const NEXT_ACTIONS: Record<
  OrderStatus,
  { label: string; status: OrderStatus; variant?: "default" | "accent" }[]
> = {
  pending: [
    { label: "Confirm order", status: "confirmed" },
    { label: "Cancel", status: "cancelled" },
  ],
  confirmed: [{ label: "Mark dispatched", status: "dispatched", variant: "accent" }],
  dispatched: [{ label: "Mark delivered", status: "delivered" }],
  delivered: [],
  cancelled: [],
};

export function OrdersManager({
  initialOrders,
  wholesalerId,
}: {
  initialOrders: OrderRow[];
  wholesalerId: string;
}) {
  const router = useRouter();
  const supabase = React.useMemo(() => createClient(), []);

  const [orders, setOrders] = React.useState<OrderRow[]>(initialOrders);
  const [filter, setFilter] = React.useState("all");
  const [selected, setSelected] = React.useState<OrderRow | null>(null);
  const [items, setItems] = React.useState<OrderItem[] | null>(null);
  const [updating, setUpdating] = React.useState(false);

  React.useEffect(() => {
    setOrders(initialOrders);
  }, [initialOrders]);

  // Realtime — new and updated orders appear without refresh.
  React.useEffect(() => {
    const channel = supabase
      .channel("wholesaler-orders")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "orders",
          filter: `wholesaler_id=eq.${wholesalerId}`,
        },
        (payload) => {
          if (payload.eventType === "INSERT") {
            toast.success("New order received", {
              description: "A retailer just placed an order.",
            });
          }
          router.refresh();
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, wholesalerId, router]);

  const filtered =
    filter === "all" ? orders : orders.filter((o) => o.status === filter);

  async function openDetail(order: OrderRow) {
    setSelected(order);
    setItems(null);
    const { data } = await supabase
      .from("order_items")
      .select("*")
      .eq("order_id", order.id);
    setItems(data ?? []);
  }

  async function updateStatus(next: OrderStatus) {
    if (!selected) return;
    setUpdating(true);
    const prev = selected.status;
    setSelected({ ...selected, status: next });
    setOrders((list) =>
      list.map((o) => (o.id === selected.id ? { ...o, status: next } : o)),
    );

    const { error } = await supabase
      .from("orders")
      .update({ status: next })
      .eq("id", selected.id);

    setUpdating(false);
    if (error) {
      setSelected({ ...selected, status: prev });
      setOrders((list) =>
        list.map((o) => (o.id === selected.id ? { ...o, status: prev } : o)),
      );
      toast.error(error.message);
      return;
    }
    toast.success(`Order ${next}`);
    router.refresh();
  }

  return (
    <div>
      <div className="mb-5 flex items-center justify-between gap-3">
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-full sm:w-52">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {STATUS_FILTERS.map((s) => (
              <SelectItem key={s.value} value={s.value}>
                {s.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <span className="hidden text-sm text-muted-foreground sm:block">
          {formatNumber(filtered.length)}{" "}
          {filtered.length === 1 ? "order" : "orders"}
        </span>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={ClipboardList}
          title="No orders here"
          description="New orders from your retailers will appear in real time."
        />
      ) : (
        <Card className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order</TableHead>
                <TableHead>Retailer</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((order) => (
                <TableRow
                  key={order.id}
                  className="cursor-pointer"
                  onClick={() => openDetail(order)}
                >
                  <TableCell className="font-medium">
                    {order.order_number}
                  </TableCell>
                  <TableCell>{order.shop_name}</TableCell>
                  <TableCell className="tabular-nums">
                    {formatNumber(order.item_count)}
                  </TableCell>
                  <TableCell className="font-medium tabular-nums">
                    {formatPKR(order.total)}
                  </TableCell>
                  <TableCell>
                    <OrderStatusBadge status={order.status} />
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {smartDate(order.created_at)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}

      <Sheet
        open={!!selected}
        onOpenChange={(o) => {
          if (!o) {
            setSelected(null);
            setItems(null);
          }
        }}
      >
        <SheetContent>
          {selected ? (
            <>
              <SheetHeader>
                <SheetTitle className="flex items-center justify-between">
                  {selected.order_number}
                  <OrderStatusBadge status={selected.status} />
                </SheetTitle>
                <SheetDescription>
                  {selected.shop_name} · {fullDate(selected.created_at)}
                </SheetDescription>
              </SheetHeader>

              <div className="flex-1 space-y-4 p-6">
                <div>
                  <p className="mb-2 text-sm font-semibold">Items</p>
                  {items === null ? (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Loader2 className="h-4 w-4 animate-spin" /> Loading…
                    </div>
                  ) : (
                    <div className="divide-y rounded-lg border">
                      {items.map((it) => (
                        <div
                          key={it.id}
                          className="flex items-center justify-between p-3"
                        >
                          <div>
                            <p className="text-sm font-medium">
                              {it.product_name}
                            </p>
                            <p className="text-xs text-muted-foreground tabular-nums">
                              {formatNumber(it.quantity)} ×{" "}
                              {formatPKR(it.unit_price)}
                            </p>
                          </div>
                          <p className="text-sm font-semibold tabular-nums">
                            {formatPKR(it.line_total)}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between rounded-lg bg-muted/50 p-3">
                  <span className="text-sm font-medium">Order total</span>
                  <span className="font-heading text-lg font-bold tabular-nums">
                    {formatPKR(selected.total)}
                  </span>
                </div>
              </div>

              <SheetFooter className="flex-col gap-2 sm:flex-col">
                {NEXT_ACTIONS[selected.status].length === 0 ? (
                  <div className="flex items-center justify-center gap-2 rounded-lg bg-muted/50 p-3 text-sm text-muted-foreground">
                    <PackageCheck className="h-4 w-4" />
                    No further action needed
                  </div>
                ) : (
                  NEXT_ACTIONS[selected.status].map((action) => (
                    <Button
                      key={action.status}
                      className="w-full"
                      variant={
                        action.status === "cancelled"
                          ? "destructive"
                          : action.variant ?? "default"
                      }
                      disabled={updating}
                      onClick={() => updateStatus(action.status)}
                    >
                      {updating ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : null}
                      {action.label}
                    </Button>
                  ))
                )}
              </SheetFooter>
            </>
          ) : null}
        </SheetContent>
      </Sheet>
    </div>
  );
}

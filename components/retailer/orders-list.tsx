"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  Check,
  ChevronDown,
  ClipboardList,
  Loader2,
  X,
} from "lucide-react";
import { toast } from "sonner";

import { createClient } from "@/lib/supabase/client";
import { cn, formatNumber, formatPKR } from "@/lib/utils";
import { smartDate } from "@/lib/format";
import type { OrderItem, OrderStatus } from "@/lib/types";
import { Card } from "@/components/ui/card";
import { OrderStatusBadge } from "@/components/status-badge";
import { EmptyState } from "@/components/empty-state";

export type RetailerOrderRow = {
  id: string;
  order_number: string;
  business_name: string;
  total: number;
  status: OrderStatus;
  created_at: string;
  item_count: number;
};

const TIMELINE: OrderStatus[] = [
  "pending",
  "confirmed",
  "dispatched",
  "delivered",
];
const STEP_LABELS: Record<string, string> = {
  pending: "Placed",
  confirmed: "Confirmed",
  dispatched: "Dispatched",
  delivered: "Delivered",
};

export function RetailerOrdersList({
  initialOrders,
  retailerId,
}: {
  initialOrders: RetailerOrderRow[];
  retailerId: string;
}) {
  const router = useRouter();
  const supabase = React.useMemo(() => createClient(), []);
  const [orders, setOrders] = React.useState(initialOrders);

  React.useEffect(() => setOrders(initialOrders), [initialOrders]);

  React.useEffect(() => {
    const channel = supabase
      .channel("retailer-orders")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "orders",
          filter: `retailer_id=eq.${retailerId}`,
        },
        (payload) => {
          if (
            payload.eventType === "UPDATE" &&
            payload.new &&
            "status" in payload.new
          ) {
            toast.info(`Order ${(payload.new as { status: string }).status}`);
          }
          router.refresh();
        },
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, retailerId, router]);

  if (orders.length === 0) {
    return (
      <EmptyState
        icon={ClipboardList}
        title="No orders yet"
        description="Your placed orders and their live status will show up here."
      />
    );
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <OrderCard key={order.id} order={order} />
      ))}
    </div>
  );
}

function OrderCard({ order }: { order: RetailerOrderRow }) {
  const supabase = React.useMemo(() => createClient(), []);
  const [open, setOpen] = React.useState(false);
  const [items, setItems] = React.useState<OrderItem[] | null>(null);

  async function toggle() {
    const next = !open;
    setOpen(next);
    if (next && items === null) {
      const { data } = await supabase
        .from("order_items")
        .select("*")
        .eq("order_id", order.id);
      setItems(data ?? []);
    }
  }

  const cancelled = order.status === "cancelled";
  const currentStep = TIMELINE.indexOf(order.status);

  return (
    <Card className="overflow-hidden">
      <button
        onClick={toggle}
        className="flex w-full items-center justify-between gap-3 p-4 text-left"
      >
        <div>
          <p className="font-medium">{order.order_number}</p>
          <p className="text-xs text-muted-foreground">
            {order.business_name} · {formatNumber(order.item_count)}{" "}
            {order.item_count === 1 ? "item" : "items"} ·{" "}
            {smartDate(order.created_at)}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="font-semibold tabular-nums">
            {formatPKR(order.total)}
          </span>
          <OrderStatusBadge status={order.status} />
          <ChevronDown
            className={cn(
              "h-4 w-4 text-muted-foreground transition-transform",
              open && "rotate-180",
            )}
          />
        </div>
      </button>

      <div className="border-t px-4 py-4">
        {cancelled ? (
          <div className="flex items-center gap-2 rounded-lg bg-rose-50 p-3 text-sm text-rose-700">
            <X className="h-4 w-4" /> This order was cancelled.
          </div>
        ) : (
          <div className="flex items-center">
            {TIMELINE.map((step, i) => {
              const done = i <= currentStep;
              const isLast = i === TIMELINE.length - 1;
              return (
                <React.Fragment key={step}>
                  <div className="flex flex-col items-center">
                    <span
                      className={cn(
                        "flex h-7 w-7 items-center justify-center rounded-full border-2 text-xs",
                        done
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border bg-background text-muted-foreground",
                      )}
                    >
                      {done ? <Check className="h-3.5 w-3.5" /> : i + 1}
                    </span>
                    <span
                      className={cn(
                        "mt-1 text-[11px]",
                        done ? "font-medium text-foreground" : "text-muted-foreground",
                      )}
                    >
                      {STEP_LABELS[step]}
                    </span>
                  </div>
                  {!isLast ? (
                    <div
                      className={cn(
                        "mx-1 h-0.5 flex-1 rounded",
                        i < currentStep ? "bg-primary" : "bg-border",
                      )}
                    />
                  ) : null}
                </React.Fragment>
              );
            })}
          </div>
        )}
      </div>

      {open ? (
        <div className="border-t bg-muted/20 p-4">
          {items === null ? (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" /> Loading items…
            </div>
          ) : (
            <div className="divide-y rounded-lg border bg-background">
              {items.map((it) => (
                <div
                  key={it.id}
                  className="flex items-center justify-between p-3"
                >
                  <div>
                    <p className="text-sm font-medium">{it.product_name}</p>
                    <p className="text-xs text-muted-foreground tabular-nums">
                      {formatNumber(it.quantity)} × {formatPKR(it.unit_price)}
                    </p>
                  </div>
                  <span className="text-sm font-semibold tabular-nums">
                    {formatPKR(it.line_total)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : null}
    </Card>
  );
}

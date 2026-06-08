import { Badge } from "@/components/ui/badge";
import type {
  InvoiceStatus,
  LinkStatus,
  OrderStatus,
} from "@/lib/types";

const ORDER_MAP: Record<
  OrderStatus,
  { label: string; variant: "amber" | "blue" | "purple" | "green" | "red" }
> = {
  pending: { label: "Pending", variant: "amber" },
  confirmed: { label: "Confirmed", variant: "blue" },
  dispatched: { label: "Dispatched", variant: "purple" },
  delivered: { label: "Delivered", variant: "green" },
  cancelled: { label: "Cancelled", variant: "red" },
};

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  const cfg = ORDER_MAP[status];
  return <Badge variant={cfg.variant}>{cfg.label}</Badge>;
}

const INVOICE_MAP: Record<
  InvoiceStatus,
  { label: string; variant: "red" | "amber" | "green" }
> = {
  unpaid: { label: "Unpaid", variant: "red" },
  partial: { label: "Partial", variant: "amber" },
  paid: { label: "Paid", variant: "green" },
};

export function InvoiceStatusBadge({ status }: { status: InvoiceStatus }) {
  const cfg = INVOICE_MAP[status];
  return <Badge variant={cfg.variant}>{cfg.label}</Badge>;
}

const LINK_MAP: Record<
  LinkStatus,
  { label: string; variant: "amber" | "green" | "red" }
> = {
  pending: { label: "Pending", variant: "amber" },
  active: { label: "Active", variant: "green" },
  blocked: { label: "Blocked", variant: "red" },
};

export function LinkStatusBadge({ status }: { status: LinkStatus }) {
  const cfg = LINK_MAP[status];
  return <Badge variant={cfg.variant}>{cfg.label}</Badge>;
}

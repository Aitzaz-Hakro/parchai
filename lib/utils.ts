import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const PKR = new Intl.NumberFormat("en-PK", {
  maximumFractionDigits: 0,
});

/** Format a number as PKR with thousands separators, e.g. PKR 1,250 */
export function formatPKR(value: number | string | null | undefined): string {
  const n = typeof value === "string" ? Number(value) : value ?? 0;
  if (Number.isNaN(n)) return "PKR 0";
  return `PKR ${PKR.format(n)}`;
}

/** Format a plain number with thousands separators, e.g. 1,250 */
export function formatNumber(value: number | string | null | undefined): string {
  const n = typeof value === "string" ? Number(value) : value ?? 0;
  if (Number.isNaN(n)) return "0";
  return PKR.format(n);
}

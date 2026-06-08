import { formatDistanceToNow, format, differenceInHours } from "date-fns";

/**
 * Relative time for recent timestamps ("2 hours ago"), full date for older
 * ones ("12 Jun 2026").
 */
export function smartDate(value: string | Date | null | undefined): string {
  if (!value) return "—";
  const date = typeof value === "string" ? new Date(value) : value;
  if (Number.isNaN(date.getTime())) return "—";

  if (differenceInHours(new Date(), date) < 24) {
    return formatDistanceToNow(date, { addSuffix: true });
  }
  return format(date, "d MMM yyyy");
}

export function fullDate(value: string | Date | null | undefined): string {
  if (!value) return "—";
  const date = typeof value === "string" ? new Date(value) : value;
  if (Number.isNaN(date.getTime())) return "—";
  return format(date, "d MMM yyyy, h:mm a");
}

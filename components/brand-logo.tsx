import { cn } from "@/lib/utils";

export function BrandLogo({
  className,
  showWordmark = true,
}: {
  className?: string;
  showWordmark?: boolean;
}) {
  return (
    <span className={cn("flex items-center gap-2", className)}>
      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          className="h-5 w-5"
          aria-hidden="true"
        >
          <path
            d="M4 9.5 12 4l8 5.5v8.5a1 1 0 0 1-1 1h-4v-6H9v6H5a1 1 0 0 1-1-1V9.5Z"
            fill="currentColor"
          />
        </svg>
      </span>
      {showWordmark ? (
        <span className="font-heading text-lg font-bold tracking-tight text-foreground">
          Parchai
        </span>
      ) : null}
    </span>
  );
}

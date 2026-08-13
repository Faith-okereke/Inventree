import { cn } from "@/lib/utils/cn";

/** Shimmering placeholder used by route-level `loading.tsx` files. */
export function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      aria-hidden
      className={cn(
        "animate-shimmer rounded-md bg-ink-200",
        "bg-[linear-gradient(90deg,var(--color-ink-200)_25%,var(--color-ink-100)_50%,var(--color-ink-200)_75%)]",
        "bg-[length:200%_100%]",
        className,
      )}
      {...props}
    />
  );
}

export function TableSkeleton({ rows = 6 }: { rows?: number }) {
  return (
    <div className="space-y-3 p-5">
      {Array.from({ length: rows }, (_, i) => (
        <Skeleton key={i} className="h-10 w-full" />
      ))}
    </div>
  );
}

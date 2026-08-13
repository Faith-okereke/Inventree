import { AppIcon, icons } from "@/components/ui/app-icon";
import { cn } from "@/lib/utils/cn";

/**
 * Builds a windowed page list with ellipses, e.g. [1, 2, 3, "…", 12].
 * Pure and dependency-free so it can be unit-tested and reused on the server.
 */
export function buildPageRange(
  current: number,
  total: number,
  siblings = 1,
): (number | "ellipsis")[] {
  if (total <= 1) return [1];

  const window = siblings * 2 + 3;
  if (total <= window + 1) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const start = Math.max(2, current - siblings);
  const end = Math.min(total - 1, current + siblings);

  const pages: (number | "ellipsis")[] = [1];
  if (start > 2) pages.push("ellipsis");
  for (let page = start; page <= end; page++) pages.push(page);
  if (end < total - 1) pages.push("ellipsis");
  pages.push(total);

  return pages;
}

export interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export function Pagination({
  page,
  totalPages,
  onPageChange,
  className,
}: PaginationProps) {
  const pages = buildPageRange(page, totalPages);

  const arrow =
    "grid size-8 place-items-center rounded-md border border-ink-200 text-ink-500 " +
    "transition-colors duration-150 ease-out-soft " +
    "hover:border-ink-300 hover:bg-ink-50 hover:text-ink-800 " +
    "disabled:pointer-events-none disabled:opacity-40";

  return (
    <nav aria-label="Pagination" className={cn("flex items-center gap-1", className)}>
      <button
        type="button"
        className={arrow}
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
        aria-label="Previous page"
      >
        <AppIcon name={icons.chevronLeft} className="size-4" />
      </button>

      {pages.map((entry, index) =>
        entry === "ellipsis" ? (
          <span
            key={`gap-${index}`}
            aria-hidden
            className="grid size-8 place-items-center text-xs text-ink-400"
          >
            …
          </span>
        ) : (
          <button
            key={entry}
            type="button"
            onClick={() => onPageChange(entry)}
            aria-current={entry === page ? "page" : undefined}
            aria-label={`Page ${entry}`}
            className={cn(
              "grid size-8 place-items-center rounded-md text-xs font-semibold",
              "transition-colors duration-150 ease-out-soft",
              entry === page
                ? "bg-brand-600 text-white"
                : "border border-ink-200 text-ink-600 hover:bg-ink-50 hover:text-ink-900",
            )}
          >
            {entry}
          </button>
        ),
      )}

      <button
        type="button"
        className={arrow}
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages}
        aria-label="Next page"
      >
        <AppIcon name={icons.chevronRight} className="size-4" />
      </button>
    </nav>
  );
}

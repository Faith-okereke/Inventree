import { cn } from "@/lib/utils/cn";

/**
 * Horizontal scroll container. On narrow screens the table scrolls sideways
 * instead of squashing columns; `tabIndex` makes that region keyboard-scrollable.
 */
export function TableScroll({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      tabIndex={0}
      role="region"
      aria-label="Table, scroll horizontally to see more"
      className={cn("scrollbar-thin w-full overflow-x-auto", className)}
      {...props}
    />
  );
}

export function Table({ className, ...props }: React.ComponentProps<"table">) {
  return (
    <table
      className={cn("w-full min-w-3xl border-collapse text-sm", className)}
      {...props}
    />
  );
}

export function Th({ className, ...props }: React.ComponentProps<"th">) {
  return (
    <th
      scope="col"
      className={cn(
        "border-b border-ink-200 bg-ink-50 px-4 py-3 text-left",
        "text-[10px] font-semibold tracking-wider text-ink-500 uppercase whitespace-nowrap",
        className,
      )}
      {...props}
    />
  );
}

export function Td({ className, ...props }: React.ComponentProps<"td">) {
  return (
    <td
      className={cn(
        "border-b border-ink-100 px-4 py-3 text-ink-700 align-middle",
        className,
      )}
      {...props}
    />
  );
}

export function Tr({ className, ...props }: React.ComponentProps<"tr">) {
  return (
    <tr
      className={cn(
        "transition-colors duration-150 ease-out-soft hover:bg-brand-50/60",
        className,
      )}
      {...props}
    />
  );
}

/** Shown in place of rows when a filter matches nothing. */
export function TableEmpty({
  colSpan,
  children,
}: {
  colSpan: number;
  children: React.ReactNode;
}) {
  return (
    <tr>
      <td colSpan={colSpan} className="px-4 py-16 text-center">
        <p className="text-sm font-medium text-ink-600">{children}</p>
      </td>
    </tr>
  );
}

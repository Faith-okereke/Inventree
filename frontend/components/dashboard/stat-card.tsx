import { AppIcon, type IconName } from "@/components/ui/app-icon";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils/cn";

/**
 * Each card carries one semantic accent so the row reads as a composed set
 * rather than four identical tiles. The classes are spelled out in full (not
 * built as `bg-${accent}-50`) so Tailwind's scanner can see them.
 */
const accents = {
  brand: {
    chip: "bg-brand-50 text-brand-600",
    glow: "var(--color-brand-500)",
  },
  success: {
    chip: "bg-success-50 text-success-600",
    glow: "var(--color-success-500)",
  },
  warn: {
    chip: "bg-warn-50 text-warn-600",
    glow: "var(--color-warn-500)",
  },
  danger: {
    chip: "bg-danger-50 text-danger-600",
    glow: "var(--color-danger-500)",
  },
} as const;

const deltaTones = {
  success: "text-success-600",
  warn: "text-warn-600",
  danger: "text-danger-600",
} as const;

const deltaDots = {
  success: "bg-success-500",
  warn: "bg-warn-500",
  danger: "bg-danger-500",
} as const;

const valueTones = {
  warn: "text-warn-600",
  danger: "text-danger-600",
} as const;

export interface StatCardProps {
  label: string;
  value: string;
  /** Secondary line: "↑12%", "Requires attention", "8 out of stock". */
  delta?: string;
  deltaTone?: keyof typeof deltaTones;
  /** Semantic identity for the icon chip and corner glow. */
  accent?: keyof typeof accents;
  /** Tints the number itself — the Products registry cards use this. */
  tone?: keyof typeof valueTones;
  icon?: IconName;
  /** Feeds the CSS stagger so cards land one after another. */
  index?: number;
}

export function StatCard({
  label,
  value,
  delta,
  deltaTone = "success",
  accent = "brand",
  tone,
  icon,
  index = 0,
}: StatCardProps) {
  const { chip, glow } = accents[accent];

  return (
    <Card
      style={{ "--stagger-index": index } as React.CSSProperties}
      className="group relative isolate overflow-hidden p-4 transition-[box-shadow,transform] duration-300 ease-out-soft hover:-translate-y-0.5 hover:shadow-md sm:p-5"
    >
      {/* Faint tonal depth in the top-right — carries the accent without a fill wash. */}
      <span
        aria-hidden
        className="pointer-events-none absolute -top-8 -right-8 -z-10 size-28 rounded-full opacity-60 blur-2xl transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: `radial-gradient(circle, color-mix(in srgb, ${glow} 22%, transparent), transparent 70%)`,
        }}
      />

      <div className="flex items-start justify-between gap-3">
        <p className="truncate pt-1 text-[11px] font-semibold tracking-wider text-ink-500 uppercase">
          {label}
        </p>
        {icon && (
          <span
            aria-hidden
            className={cn(
              "grid size-10 shrink-0 place-items-center rounded-xl",
              chip,
            )}
          >
            <AppIcon name={icon} className="size-[18px]" />
          </span>
        )}
      </div>

      <p
        className={cn(
          "mt-4 text-3xl font-bold tracking-tight text-ink-900 tabular-nums",
          tone && valueTones[tone],
        )}
      >
        {value}
      </p>

      {delta && (
        <p
          className={cn(
            "mt-2 flex items-center gap-1.5 truncate text-xs font-semibold",
            deltaTones[deltaTone],
          )}
        >
          <span
            aria-hidden
            className={cn(
              "size-1.5 shrink-0 rounded-full",
              deltaDots[deltaTone],
            )}
          />
          {delta}
        </p>
      )}
    </Card>
  );
}

/** Responsive stat grid. Defaults to 4-up; the Overview hero row uses 3-up. */
export function StatGrid({
  children,
  columns = 4,
}: {
  children: React.ReactNode;
  columns?: 3 | 4;
}) {
  return (
    <div
      className={cn(
        "stagger-children grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4",
        columns === 4 ? "xl:grid-cols-4" : "lg:grid-cols-3",
      )}
    >
      {children}
    </div>
  );
}

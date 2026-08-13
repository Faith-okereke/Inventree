import { AppIcon, type IconName } from "@/components/ui/app-icon";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils/cn";

const deltaTones = {
  success: "text-success-600",
  warn: "text-warn-600",
  danger: "text-danger-600",
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
  /** Tints the number itself — the Products registry cards use this. */
  tone?: keyof typeof valueTones;
  icon?: IconName;
  /** Feeds the CSS stagger so cards land one after another. */
  index?: number;
}

/**
 * Server Component. Covers both card flavours in the design: the Overview cards
 * (icon + delta) and the Products registry cards (uppercase label, tinted value).
 */
export function StatCard({
  label,
  value,
  delta,
  deltaTone = "success",
  tone,
  icon,
  index = 0,
}: StatCardProps) {
  return (
    <Card
      style={{ "--stagger-index": index } as React.CSSProperties}
      className="flex items-start justify-between gap-3 p-4 transition-[box-shadow,transform] duration-300 ease-out-soft hover:-translate-y-0.5 hover:shadow-md sm:p-5"
    >
      <div className="min-w-0">
        <p className="truncate text-[11px] font-semibold tracking-wider text-ink-500 uppercase">
          {label}
        </p>
        <p
          className={cn(
            "mt-2 text-2xl font-bold tracking-tight text-ink-900 tabular-nums sm:text-[28px]",
            tone && valueTones[tone],
          )}
        >
          {value}
        </p>
        {delta && (
          <p
            className={cn(
              "mt-1 truncate text-xs font-semibold",
              deltaTones[deltaTone],
            )}
          >
            {delta}
          </p>
        )}
      </div>

      {icon && (
        <span
          aria-hidden
          className="grid size-10 shrink-0 place-items-center rounded-lg bg-brand-50 text-brand-600"
        >
          <AppIcon name={icon} className="size-5" />
        </span>
      )}
    </Card>
  );
}

/** 1 → 2 → 4 columns, with the stagger utility applied to the children. */
export function StatGrid({ children }: { children: React.ReactNode }) {
  return (
    <div className="stagger-children grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 xl:grid-cols-4">
      {children}
    </div>
  );
}

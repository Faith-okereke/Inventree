import { cn } from "@/lib/utils/cn";

export type BadgeTone =
  | "brand"
  | "neutral"
  | "success"
  | "warn"
  | "danger";

const tones: Record<BadgeTone, string> = {
  brand: "bg-brand-100 text-brand-700",
  neutral: "bg-ink-100 text-ink-600",
  success: "bg-success-50 text-success-700",
  warn: "bg-warn-50 text-warn-700",
  danger: "bg-danger-50 text-danger-700",
};

/** Maps the status strings used across the tables onto a tone. */
const statusTones: Record<string, BadgeTone> = {
  "in stock": "success",
  fulfilled: "success",
  active: "success",
  "low stock": "warn",
  pending: "warn",
  "out of stock": "danger",
  "stock out": "danger",
  cancelled: "danger",
  admin: "brand",
  staff: "neutral",
};

export function statusTone(status: string): BadgeTone {
  return statusTones[status.toLowerCase()] ?? "neutral";
}

export interface BadgeProps extends React.ComponentProps<"span"> {
  tone?: BadgeTone;
  uppercase?: boolean;
}

export function Badge({
  className,
  tone = "neutral",
  uppercase = false,
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-semibold whitespace-nowrap",
        uppercase && "tracking-wide uppercase",
        tones[tone],
        className,
      )}
      {...props}
    />
  );
}

/** Convenience wrapper: derives the tone from the status text itself. */
export function StatusBadge({
  status,
  className,
}: {
  status: string;
  className?: string;
}) {
  return (
    <Badge tone={statusTone(status)} uppercase className={className}>
      {status}
    </Badge>
  );
}

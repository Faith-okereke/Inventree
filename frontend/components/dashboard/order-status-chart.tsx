import { EmptyState } from "@/components/dashboard/empty-state";
import { icons } from "@/components/ui/app-icon";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/card";
import { formatNumber } from "@/lib/utils/format";

/**
 * A true circle rather than a rotated rounded-rect: on a circle the arc length
 * is uniform, so equal percentages read as equal wedges. `pathLength="100"`
 * normalises the circumference to 100, which lets `stroke-dasharray` be written
 * directly in percent and keeps the CSS-only `ring-draw` animation working.
 * Rotated -90deg so the first slice starts at twelve o'clock.
 */
const ring = {
  cx: 100,
  cy: 100,
  r: 62,
  pathLength: 100,
  fill: "none",
  strokeWidth: 22,
  transform: "rotate(-90 100 100)",
} as const;

/**
 * Surface gap between adjacent slices, in the same percent units as the ring.
 * Caps are `butt`, not `round`: a round cap extends the arc by half the stroke
 * width at each end (~2.8 units here), which would overrun this gap and make
 * small slices read far larger than they are.
 */
const SLICE_GAP = 1.2;

const statusData = [
  { label: "Fulfilled", status: "fulfilled", colorVar: "var(--color-success-500)" },
  { label: "Pending", status: "pending", colorVar: "var(--color-warn-500)" },
  { label: "Cancelled", status: "cancelled", colorVar: "var(--color-brand-600)" },
];

export function OrderStatusChart({
  ordersByStatus,
  total,
}: {
  ordersByStatus: Record<string, number>;
  total: number;
}) {
  // Geometry uses exact fractions; only the label is rounded, so the slices
  // always close the ring even when the displayed percents don't sum to 100.
  const measured = statusData.map((slice) => {
    const count = ordersByStatus[slice.status] ?? 0;
    return {
      ...slice,
      count,
      exact: total === 0 ? 0 : (count / total) * 100,
    };
  });

  const slices = measured.map((slice, index) => ({
    ...slice,
    start: measured
      .slice(0, index)
      .reduce((sum, previous) => sum + previous.exact, 0),
    percent: Math.round(slice.exact),
  }));

  return (
    <Card className="animate-fade-up flex flex-col">
      <CardHeader>
        <CardTitle>Order Status</CardTitle>
        <span className="text-[11px] font-semibold tracking-wider text-ink-400 uppercase">
          Orders
        </span>
      </CardHeader>

      <CardBody className="flex flex-1 flex-col items-center justify-center gap-6 sm:flex-row sm:gap-8">
        {total === 0 ? (
          <EmptyState
            icon={icons.orders}
            title="No orders yet"
            description="Once you record an order, its status breakdown appears here."
            action={{ label: "Go to Orders", href: "/orders" }}
          />
        ) : (
          <>
            <div className="relative size-52 shrink-0">
          <svg viewBox="0 0 200 200" aria-hidden className="size-full">
            <circle {...ring} className="stroke-ink-100" />
            {slices.map((slice) => {
              // Never let the gap eat a slice that is genuinely present.
              const drawn =
                slice.exact > 0 ? Math.max(slice.exact - SLICE_GAP, 0.5) : 0;
              return (
                <circle
                  key={slice.label}
                  {...ring}
                  stroke={slice.colorVar}
                  strokeLinecap="butt"
                  className="animate-ring-draw"
                  style={{
                    strokeDasharray: `${drawn} ${100 - drawn}`,
                    strokeDashoffset: -slice.start,
                    animationDelay: `${Math.round(slice.start) * 6}ms`,
                  }}
                />
              );
            })}
          </svg>

          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-[10px] font-semibold tracking-wider text-ink-500 uppercase">
              Total
            </span>
            <span className="text-3xl font-bold text-ink-900 tabular-nums">
              {formatNumber(total)}
            </span>
          </div>
        </div>

            <dl className="w-full max-w-56 space-y-3">
              {slices.map((slice) => (
                <div key={slice.label} className="flex items-center gap-2.5">
                  <span
                    aria-hidden
                    className="size-2.5 shrink-0 rounded-full"
                    style={{ backgroundColor: slice.colorVar }}
                  />
                  <dt className="flex-1 text-sm text-ink-600">{slice.label}</dt>
                  <dd className="text-sm font-semibold text-ink-900 tabular-nums">
                    {slice.percent}%{" "}
                    <span className="text-ink-400">
                      ({formatNumber(slice.count)})
                    </span>
                  </dd>
                </div>
              ))}
            </dl>
          </>
        )}
      </CardBody>
    </Card>
  );
}

import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/card";
import { ORDER_STATUS_TOTAL, orderStatusBreakdown } from "@/lib/data/dashboard";
import { formatNumber } from "@/lib/utils/format";

/**
 * Where each slice starts, as a running total of the ones before it.
 *
 * Computed at module scope from a module constant: it never changes, so it is
 * done once at import rather than on every render — and it stays a pure
 * expression instead of a counter mutated inside `map`.
 */
const slices = orderStatusBreakdown.map((slice, index) => ({
  ...slice,
  start: orderStatusBreakdown
    .slice(0, index)
    .reduce((sum, previous) => sum + previous.percent, 0),
}));

const ring = {
  x: 48,
  y: 48,
  width: 104,
  height: 104,
  rx: 20,
  pathLength: 100,
  fill: "none",
  strokeWidth: 20,
  transform: "rotate(45 100 100)",
} as const;

/**
 * The Figma frame draws this breakdown as a rotated rounded square rather than a
 * circle, so the ring is a `<rect>` turned 45°.
 *
 * `pathLength="100"` renormalises the perimeter to 100 units, which lets each
 * slice's `stroke-dasharray` be written as its raw percentage — no arc maths, and
 * the geometry can change without touching the numbers.
 *
 * Server Component: the reveal is a CSS keyframe (`ring-draw`), so the chart
 * ships zero JavaScript.
 */
export function OrderStatusChart() {
  return (
    <Card className="animate-fade-up flex flex-col">
      <CardHeader>
        <CardTitle>Order Status</CardTitle>
      </CardHeader>

      <CardBody className="flex flex-1 flex-col items-center justify-center gap-6 sm:flex-row sm:gap-8">
        <div className="relative size-44 shrink-0">
          <svg viewBox="0 0 200 200" aria-hidden className="size-full">
            <rect {...ring} className="stroke-ink-100" />
            {slices.map((slice) => (
              <rect
                key={slice.label}
                {...ring}
                stroke={slice.colorVar}
                strokeLinecap="butt"
                className="animate-ring-draw"
                style={{
                  strokeDasharray: `${slice.percent} ${100 - slice.percent}`,
                  strokeDashoffset: -slice.start,
                  animationDelay: `${slice.start * 6}ms`,
                }}
              />
            ))}
          </svg>

          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-[10px] font-semibold tracking-wider text-ink-500 uppercase">
              Total
            </span>
            <span className="text-2xl font-bold text-ink-900 tabular-nums">
              {formatNumber(ORDER_STATUS_TOTAL)}
            </span>
          </div>
        </div>

        {/* The legend carries the same numbers as text, so the chart needs no
            accessible description of its own. */}
        <dl className="w-full max-w-56 space-y-3">
          {slices.map((slice) => (
            <div key={slice.label} className="flex items-center gap-2.5">
              <span
                aria-hidden
                className="size-2.5 shrink-0 rounded-sm"
                style={{ backgroundColor: slice.colorVar }}
              />
              <dt className="flex-1 text-sm text-ink-600">{slice.label}</dt>
              <dd className="text-sm font-semibold text-ink-900 tabular-nums">
                {slice.percent}%
              </dd>
            </div>
          ))}
        </dl>
      </CardBody>
    </Card>
  );
}

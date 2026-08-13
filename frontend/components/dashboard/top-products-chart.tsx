import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/card";
import { topMovingProducts } from "@/lib/data/dashboard";
import { formatNumber } from "@/lib/utils/format";

/**
 * Server Component. Bars grow with a `scaleX` keyframe rather than an animated
 * `width`, so the reveal runs on the compositor and never triggers layout.
 */
export function TopProductsChart() {
  const max = Math.max(...topMovingProducts.map((product) => product.units));

  return (
    <Card className="animate-fade-up flex flex-col">
      <CardHeader>
        <CardTitle>Top Moving Products</CardTitle>
        <span className="text-[11px] font-semibold tracking-wider text-ink-400 uppercase">
          Units
        </span>
      </CardHeader>

      <CardBody className="flex-1">
        <ol className="space-y-4">
          {topMovingProducts.map((product, index) => (
            <li key={product.name} className="space-y-1.5">
              <div className="flex items-baseline justify-between gap-3">
                <span className="truncate text-sm font-medium text-ink-700">
                  {product.name}
                </span>
                <span className="shrink-0 text-sm font-semibold text-ink-900 tabular-nums">
                  {formatNumber(product.units)}
                </span>
              </div>

              <div className="h-2 w-full overflow-hidden rounded-full bg-ink-100">
                <div
                  className="animate-bar-grow h-full origin-left rounded-full bg-brand-600"
                  style={{
                    width: `${(product.units / max) * 100}%`,
                    animationDelay: `${index * 70}ms`,
                  }}
                />
              </div>
            </li>
          ))}
        </ol>
      </CardBody>
    </Card>
  );
}

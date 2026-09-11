import { EmptyState } from "@/components/dashboard/empty-state";
import { icons } from "@/components/ui/app-icon";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/card";
import { formatNumber } from "@/lib/utils/format";
import type { DashboardTopProduct } from "@/types/dashboard";

export function TopProductsChart({
  products,
}: {
  products: DashboardTopProduct[];
}) {
  const topMovingProducts = products.map((product) => ({
    name: product.name,
    units: product.totalQuantity,
  }));
  // Guard the empty case — `Math.max()` with no args returns -Infinity.
  const max = topMovingProducts.length
    ? Math.max(...topMovingProducts.map((product) => product.units))
    : 0;

  return (
    <Card className="animate-fade-up flex flex-col">
      <CardHeader>
        <CardTitle>Top Moving Products</CardTitle>
        <span className="text-[11px] font-semibold tracking-wider text-ink-400 uppercase">
          Units
        </span>
      </CardHeader>

      <CardBody className="flex-1">
        {topMovingProducts.length === 0 ? (
          <EmptyState
            icon={icons.trendUp}
            title="No product movement yet"
            description="Fulfil an order and your best sellers will rank here."
            action={{ label: "View Products", href: "/products" }}
          />
        ) : (
          <ol className="space-y-4">
            {topMovingProducts.map((product, index) => (
              <li key={product.name} className="space-y-1.5">
                <div className="flex items-baseline gap-3">
                  {/* Rank marker — turns a flat list into a readable leaderboard. */}
                  <span
                    aria-hidden
                    className="w-5 shrink-0 font-mono text-[11px] font-semibold text-ink-300 tabular-nums"
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="min-w-0 flex-1 truncate text-sm font-medium text-ink-700">
                    {product.name}
                  </span>
                  <span className="shrink-0 text-sm font-semibold text-ink-900 tabular-nums">
                    {formatNumber(product.units)}
                  </span>
                </div>

                {/* ms-8 = rank marker (w-5) + gap-3, so the track lines up under the name. */}
                <div className="ms-8 h-2 overflow-hidden rounded-full bg-ink-100">
                  <div
                    className="animate-bar-grow h-full origin-left rounded-full bg-brand-600"
                    style={{
                      width: `${max > 0 ? (product.units / max) * 100 : 0}%`,
                      animationDelay: `${index * 70}ms`,
                    }}
                  />
                </div>
              </li>
            ))}
          </ol>
        )}
      </CardBody>
    </Card>
  );
}

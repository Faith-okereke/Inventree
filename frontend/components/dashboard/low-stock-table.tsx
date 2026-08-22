import { StatusBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableScroll, Td, Th, Tr } from "@/components/ui/table";
import type { ProductResponse } from "@/lib/data/types";
import { formatNumber } from "@/lib/utils/format";
import { cn } from "@/lib/utils/cn";

/**
 * Server Component — this table has no filters or pagination, so unlike the three
 * registry tables it crosses no client boundary at all.
 */
export function LowStockTable({ products }: { products: ProductResponse[] }) {
  return (
    <Card className="animate-fade-up overflow-hidden">
      <CardHeader>
        <CardTitle>Low Stock Alerts</CardTitle>
        <span className="text-xs font-medium text-ink-500">
          {products.length} items below reorder point
        </span>
      </CardHeader>

      <TableScroll>
        <Table className="min-w-2xl">
          <thead>
            <tr>
              <Th>SKU</Th>
              <Th>Product Name</Th>
              <Th className="text-right">Current Qty</Th>
              <Th className="hidden text-right sm:table-cell">Reorder Pt.</Th>
              <Th>Status</Th>
              <Th className="text-right">Action</Th>
            </tr>
          </thead>
          <tbody>
            {products.map((product, index) => (
              <Tr
                key={product.id}
                className="animate-fade-in"
                style={{ animationDelay: `${index * 35}ms` }}
              >
                <Td className="font-mono text-xs font-semibold text-ink-600 whitespace-nowrap">
                  {product.sku}
                </Td>
                <Td className="font-medium text-ink-800">{product.name}</Td>
                <Td
                  className={cn(
                    "text-right font-semibold tabular-nums",
                    product.quantityInStock === 0
                      ? "text-danger-600"
                      : "text-warn-600",
                  )}
                >
                  {formatNumber(product.quantityInStock)}
                </Td>
                <Td className="hidden text-right text-ink-500 tabular-nums sm:table-cell">
                  {formatNumber(5)}
                </Td>
                <Td>
                  <StatusBadge
                    status={product.quantityInStock === 0 ? "Stock Out" : "Low Stock"}
                  />
                </Td>
                <Td className="text-right">
                  {/* Raising a purchase order needs a backend; the button is the
                      designed affordance for it. */}
                  <Button variant="secondary" size="sm">
                    Reorder
                  </Button>
                </Td>
              </Tr>
            ))}
          </tbody>
        </Table>
      </TableScroll>
    </Card>
  );
}

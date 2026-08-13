"use client";

import { useMemo } from "react";

import { TableFooter } from "@/components/dashboard/table-footer";
import { AppIcon, type IconName } from "@/components/ui/app-icon";
import { StatusBadge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableEmpty,
  TableScroll,
  Td,
  Th,
  Tr,
} from "@/components/ui/table";
import { filterProducts } from "@/lib/data/filters";
import { paginate } from "@/lib/data/pagination";
import { products } from "@/lib/data/products";
import { formatCurrency, formatNumber } from "@/lib/utils/format";
import { cn } from "@/lib/utils/cn";
import { useAppSelector } from "@/store/hooks";

const COLUMN_COUNT = 7;

function stockTone(stock: number) {
  if (stock === 0) return "text-danger-600";
  if (stock <= 5) return "text-warn-600";
  return "text-ink-800";
}

/**
 * Stand-in for the product photo in the design's IMAGE column. To use real
 * assets, replace this span with:
 *   <Image src={product.image} alt="" width={40} height={40} className="rounded-lg object-cover" />
 */
function ProductThumb({ icon }: { icon: IconName }) {
  return (
    <span
      aria-hidden
      className="grid size-10 place-items-center rounded-lg bg-ink-100 text-ink-500 ring-1 ring-ink-200 ring-inset"
    >
      <AppIcon name={icon} className="size-5" />
    </span>
  );
}

export function ProductsTable() {
  const filters = useAppSelector((s) => s.filters.products);

  const view = useMemo(
    () => paginate(filterProducts(products, filters), filters.page),
    [filters],
  );

  return (
    <Card className="animate-fade-up overflow-hidden">
      <TableScroll>
        <Table>
          <thead>
            <tr>
              <Th className="w-16">Image</Th>
              <Th>SKU</Th>
              <Th>Product Name</Th>
              <Th className="hidden md:table-cell">Category</Th>
              <Th className="text-right">Price</Th>
              <Th className="hidden text-right sm:table-cell">Stock</Th>
              <Th>Status</Th>
            </tr>
          </thead>
          <tbody>
            {view.rows.length === 0 ? (
              <TableEmpty colSpan={COLUMN_COUNT}>
                No products match the current filters.
              </TableEmpty>
            ) : (
              view.rows.map((product, index) => (
                <Tr
                  key={product.sku}
                  className="animate-fade-in"
                  style={{ animationDelay: `${index * 35}ms` }}
                >
                  <Td>
                    <ProductThumb icon={product.icon as IconName} />
                  </Td>
                  <Td className="font-mono text-xs font-semibold text-ink-600 whitespace-nowrap">
                    {product.sku}
                  </Td>
                  <Td
                    className={cn(
                      "max-w-[22ch] font-medium text-ink-800 sm:max-w-none",
                      product.discontinued && "text-ink-500 line-through",
                    )}
                  >
                    {product.name}
                  </Td>
                  <Td className="hidden text-ink-500 whitespace-nowrap md:table-cell">
                    {product.category}
                  </Td>
                  <Td className="text-right font-semibold text-ink-900 tabular-nums whitespace-nowrap">
                    {formatCurrency(product.price)}
                  </Td>
                  <Td
                    className={cn(
                      "hidden text-right font-semibold tabular-nums sm:table-cell",
                      stockTone(product.stock),
                    )}
                  >
                    {formatNumber(product.stock)}
                  </Td>
                  <Td>
                    <StatusBadge status={product.status} />
                  </Td>
                </Tr>
              ))
            )}
          </tbody>
        </Table>
      </TableScroll>

      <TableFooter
        table="products"
        from={view.from}
        to={view.to}
        total={view.total}
        page={view.page}
        totalPages={view.totalPages}
      />
    </Card>
  );
}

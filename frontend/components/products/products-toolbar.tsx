"use client";

import { FilterPopover } from "@/components/dashboard/filter-popover";
import { AppIcon, icons } from "@/components/ui/app-icon";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import type { ProductResponse } from "@/lib/data/types";
import { downloadCsv, toCsv } from "@/lib/utils/csv";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { resetFilters, setFilter } from "@/store/slices/filters.slice";

const stockOptions = [
  { value: "all", label: "All stock" },
  { value: "in-stock", label: "In Stock" },
  { value: "low-stock", label: "Low Stock" },
  { value: "out-of-stock", label: "Out of Stock" },
] as const;

export function ProductsToolbar({ products }: { products: readonly ProductResponse[] }) {
  const filters = useAppSelector((s) => s.filters.products);
  const dispatch = useAppDispatch();

  function exportCsv() {
    const rows = products.map((product) => [
      product.sku,
      product.name,
      product.description,
      product.price,
      product.quantityInStock,
    ]);

    downloadCsv(
      "products.csv",
      toCsv(
        ["SKU", "Product Name", "Description", "Price", "Stock"],
        rows,
      ),
    );
  }

  const activeCount =
    Number(filters.search.trim() !== "") + Number(filters.status !== "all");

  return (
    <>
      <FilterPopover activeCount={activeCount}>
        <Select
          id="products-stock-filter"
          label="Stock"
          options={stockOptions}
          value={filters.status}
          onChange={(e) =>
            dispatch(
              setFilter({ table: "products", patch: { status: e.target.value } }),
            )
          }
          className="mt-1"
        />
        <Button
          variant="ghost"
          size="sm"
          className="w-full"
          onClick={() => dispatch(resetFilters("products"))}
        >
          Clear filters
        </Button>
      </FilterPopover>

      <Button variant="secondary" size="sm" className="h-9" onClick={exportCsv}>
        <AppIcon name={icons.export} className="size-4" />
        Export
      </Button>

      <Button size="sm" className="h-9">
        <AppIcon name={icons.plus} className="size-4" />
        Create Product
      </Button>
    </>
  );
}

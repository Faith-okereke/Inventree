"use client";

import { FilterPopover } from "@/components/dashboard/filter-popover";
import { AppIcon, icons } from "@/components/ui/app-icon";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { filterProducts } from "@/lib/data/filters";
import { products } from "@/lib/data/products";
import { downloadCsv, toCsv } from "@/lib/utils/csv";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setFilter } from "@/store/slices/filters.slice";

const statusOptions = [
  { value: "all", label: "All stock levels" },
  { value: "in-stock", label: "In Stock" },
  { value: "low-stock", label: "Low Stock" },
  { value: "out-of-stock", label: "Out of Stock" },
] as const;

export function ProductsToolbar() {
  const filters = useAppSelector((s) => s.filters.products);
  const dispatch = useAppDispatch();

  function exportCsv() {
    const rows = filterProducts(products, filters).map((product) => [
      product.sku,
      product.name,
      product.category,
      product.price,
      product.stock,
      product.status,
    ]);

    downloadCsv(
      "products.csv",
      toCsv(
        ["SKU", "Product Name", "Category", "Price", "Stock", "Status"],
        rows,
      ),
    );
  }

  return (
    <>
      <FilterPopover activeCount={filters.status === "all" ? 0 : 1}>
        <Select
          id="products-status-filter"
          label="Stock"
          options={statusOptions}
          value={filters.status}
          onChange={(e) =>
            dispatch(
              setFilter({
                table: "products",
                patch: { status: e.target.value },
              }),
            )
          }
          className="mt-1"
        />
        <Button
          variant="ghost"
          size="sm"
          className="w-full"
          onClick={() =>
            dispatch(
              setFilter({
                table: "products",
                patch: { status: "all", search: "" },
              }),
            )
          }
        >
          Clear filters
        </Button>
      </FilterPopover>

      <Button variant="secondary" size="sm" className="h-9" onClick={exportCsv}>
        <AppIcon name={icons.export} className="size-4" />
        Export
      </Button>
    </>
  );
}

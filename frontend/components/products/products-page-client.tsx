"use client";

import { useMemo, useState } from "react";

import { useGetAllProducts } from "@/api/hooks/useProducts";
import { FilterPopover } from "@/components/dashboard/filter-popover";
import { PageHeader } from "@/components/dashboard/page-header";
import { StatCard, StatGrid } from "@/components/dashboard/stat-card";
import { ProductFormModal } from "@/components/products/product-form-modal";
import { ProductsTable } from "@/components/products/products-table";
import { AppIcon, icons } from "@/components/ui/app-icon";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { downloadCsv, toCsv } from "@/lib/utils/csv";
import { formatCurrency } from "@/lib/utils/format";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { resetFilters, setFilter } from "@/store/slices/filters.slice";

const stockOptions = [
  { value: "all", label: "All stock" },
  { value: "in-stock", label: "In Stock" },
  { value: "low-stock", label: "Low Stock" },
  { value: "out-of-stock", label: "Out of Stock" },
] as const;

export function ProductsPageClient() {
  const filters = useAppSelector((s) => s.filters.products);
  const dispatch = useAppDispatch();
  const [createOpen, setCreateOpen] = useState(false);
  const { data: products = [], pagination, isLoading } = useGetAllProducts(
    filters.page,
  );

  const stats = useMemo(() => {
    const lowStockCount = products.filter(
      (product) => product.quantityInStock <= 5,
    ).length;
    const outOfStockCount = products.filter(
      (product) => product.quantityInStock <= 0,
    ).length;
    const inventoryValue = products.reduce(
      (total, product) =>
        total + Number(product.price) * product.quantityInStock,
      0,
    );

    return [
      { label: "Total Products", value: String(products.length) },
      {
        label: "Low Stock ",
        value: String(lowStockCount),
        tone: "warn" as const,
      },
      {
        label: "Out of Stock",
        value: String(outOfStockCount),
        tone: "danger" as const,
      },
      { label: "Est. Inventory Value", value: formatCurrency(inventoryValue) },
    ];
  }, [products]);

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
      toCsv(["SKU", "Product Name", "Description", "Price", "Stock"], rows),
    );
  }

  const activeCount =
    Number(filters.search.trim() !== "") + Number(filters.status !== "all");

  return (
    <>
      <PageHeader
        title="Products Registry"
        subtitle="Read-only view of current inventory levels and pricing."
        className="relative "
      >
        <FilterPopover activeCount={activeCount}>
          <Select
            id="products-stock-filter"
            label="Stock"
            options={stockOptions}
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
            onClick={() => dispatch(resetFilters("products"))}
          >
            Clear filters
          </Button>
        </FilterPopover>

        <Button
          variant="secondary"
          size="sm"
          className="h-9"
          onClick={exportCsv}
        >
          <AppIcon name={icons.export} className="size-4" />
          Export
        </Button>

        <Button size="sm" className="h-9" onClick={() => setCreateOpen(true)}>
          <AppIcon name={icons.plus} className="size-4" />
          Create Product
        </Button>
      </PageHeader>

      <div className="relative pb-24">
        <StatGrid>
          {stats.map((stat, index) => (
            <StatCard
              key={stat.label}
              index={index}
              label={stat.label}
              value={isLoading ? "0" : stat.value}
              tone={stat.tone}
            />
          ))}
        </StatGrid>

        <ProductsTable products={products} pagination={pagination} />
      </div>

      <ProductFormModal open={createOpen} onOpenChange={setCreateOpen} />
    </>
  );
}

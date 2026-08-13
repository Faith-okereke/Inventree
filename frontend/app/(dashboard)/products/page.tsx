import type { Metadata } from "next";

import { PageHeader } from "@/components/dashboard/page-header";
import { StatCard, StatGrid } from "@/components/dashboard/stat-card";
import { ProductsTable } from "@/components/products/products-table";
import { ProductsToolbar } from "@/components/products/products-toolbar";
import { productStats } from "@/lib/data/products";

export const metadata: Metadata = {
  title: "Products Registry",
  description: "Read-only view of current inventory levels and pricing.",
};

/** Server Component; the stat cards are static and never reach the client. */
export default function ProductsPage() {
  return (
    <>
      <PageHeader
        title="Products Registry"
        subtitle="Read-only view of current inventory levels and pricing."
      >
        <ProductsToolbar />
      </PageHeader>

      <StatGrid>
        {productStats.map((stat, index) => (
          <StatCard
            key={stat.label}
            index={index}
            label={stat.label}
            value={stat.value}
            tone={stat.tone}
          />
        ))}
      </StatGrid>

      <ProductsTable />
    </>
  );
}

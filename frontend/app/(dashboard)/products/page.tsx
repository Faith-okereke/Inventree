import type { Metadata } from "next";

import { ProductsPageClient } from "@/components/products/products-page-client";

export const metadata: Metadata = {
  title: "Products Registry",
  description: "Read-only view of current inventory levels and pricing.",
};

export default function ProductsPage() {
  return <ProductsPageClient />;
}
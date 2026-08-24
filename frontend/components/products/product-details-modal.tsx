"use client";

import { DashboardModal } from "@/components/dashboard/dashboard-modal";
import type { ProductResponse } from "@/lib/data/types";
import { formatCurrency, formatNumber } from "@/lib/utils/format";

export function ProductDetailsModal({
  product,
  open,
  onOpenChange,
}: {
  product: ProductResponse;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <DashboardModal
      open={open}
      onOpenChange={onOpenChange}
      title={product.name}
      description="Product details"
      widthClassName="max-w-lg"
      className=""
    >
      <div className="grid gap-5 sm:grid-cols-[140px_1fr] overflow-y-auto min-h-[50vh] max-h-[80vh] pb-6">
        <img
          src={product.image}
          alt={product.name}
          width={140}
          height={140}
          className="aspect-square w-full rounded-xl object-cover "
        />
        <dl className="grid gap-4 sm:grid-cols-2">
          <div>
            <dt className="text-xs font-semibold tracking-wide text-ink-500 uppercase">SKU</dt>
            <dd className="mt-1 font-mono text-sm text-ink-900">{product.sku}</dd>
          </div>
          <div>
            <dt className="text-xs font-semibold tracking-wide text-ink-500 uppercase">Price</dt>
            <dd className="mt-1 text-sm font-semibold text-ink-900">{formatCurrency(Number(product.price))}</dd>
          </div>
          <div>
            <dt className="text-xs font-semibold tracking-wide text-ink-500 uppercase">Stock</dt>
            <dd className="mt-1 text-sm text-ink-900">{formatNumber(product.quantityInStock)}</dd>
          </div>
          <div className="sm:col-span-2">
            <dt className="text-xs font-semibold tracking-wide text-ink-500 uppercase">Description</dt>
            <dd className="mt-1 text-sm leading-6 text-ink-700">{product.description}</dd>
          </div>
        </dl>
      </div>
    </DashboardModal>
  );
}
"use client";

import { DashboardModal } from "@/components/dashboard/dashboard-modal";
import type { OrderListResponse } from "@/lib/data/types";
import { formatCurrency, formatNumber } from "@/lib/utils/format";

export function OrderDetailsModal({
  order,
  open,
  onOpenChange,
}: {
  order: OrderListResponse;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const total = order.orderItems.reduce(
    (sum, item) => sum + Number(item.priceAtOrder) * item.quantity,
    0,
  );
  const quantity = order.orderItems.reduce(
    (sum, item) => sum + item.quantity,
    0,
  );

  return (
    <DashboardModal
      open={open}
      onOpenChange={onOpenChange}
      title={`Order ${order.id}`}
      description="Order details"
      widthClassName="max-w-2xl"
    >
      <dl className="grid gap-4 sm:grid-cols-3">
        <div>
          <dt className="text-xs font-semibold tracking-wide text-ink-500 uppercase">
            Customer
          </dt>
          <dd className="mt-1 text-sm text-ink-900">{order.user.name}</dd>
        </div>
        <div>
          <dt className="text-xs font-semibold tracking-wide text-ink-500 uppercase">
            Date
          </dt>
          <dd className="mt-1 text-sm text-ink-900">
            {new Date(order.createdAt).toLocaleDateString()}
          </dd>
        </div>
        <div>
          <dt className="text-xs font-semibold tracking-wide text-ink-500 uppercase">
            Status
          </dt>
          <dd className="mt-1 text-sm capitalize text-ink-900">
            {order.status}
          </dd>
        </div>
        <div>
          <dt className="text-xs font-semibold tracking-wide text-ink-500 uppercase">
            Items
          </dt>
          <dd className="mt-1 text-sm text-ink-900">
            {formatNumber(quantity)}
          </dd>
        </div>
        <div>
          <dt className="text-xs font-semibold tracking-wide text-ink-500 uppercase">
            Total
          </dt>
          <dd className="mt-1 text-sm font-semibold text-ink-900">
            {formatCurrency(total)}
          </dd>
        </div>
      </dl>
      <div className="mt-6 overflow-hidden rounded-lg border border-ink-200">
        {order.orderItems.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between gap-4 border-b border-ink-200 px-4 py-3 last:border-b-0"
          >
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-ink-900">
                {item.product.name}
              </p>
              <p className="text-xs text-ink-500">{item.product.sku}</p>
            </div>
            <div className="shrink-0 text-right text-sm text-ink-700">
              {formatNumber(item.quantity)} x{" "}
              {formatCurrency(Number(item.priceAtOrder))}
            </div>
          </div>
        ))}
      </div>
    </DashboardModal>
  );
}

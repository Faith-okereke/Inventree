"use client";

import { useState } from "react";

import {
  ConfirmModal,
  DashboardModal,
} from "@/components/dashboard/dashboard-modal";
import { Button } from "@/components/ui/button";
import type { OrderStatus, ProductResponse } from "@/lib/data/types";
import { useGetAllProducts } from "@/api/hooks/useProducts";
import { useCreateOrder } from "@/api/hooks/useOrders";

interface OrderFormValues {
  product: string;
  customer: string;
  quantity: number;
  total: string;
  status: OrderStatus;
}

const emptyValues: OrderFormValues = {
  product: ``,
  customer: "",
  quantity: 0,
  total: "",
  status: "pending",
};

function inputClassName() {
  return [
    "h-10 w-full rounded-lg border border-ink-200 bg-white px-3 text-sm text-ink-900",
    "transition-[border-color,box-shadow] duration-200 ease-out-soft",
    "placeholder:text-ink-400 hover:border-ink-300 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20",
  ].join(" ");
}

function OrderFormContent({
  onSubmit,
  onCancel,
  products,
}: {
  onSubmit: (values: OrderFormValues) => void;
  onCancel: () => void;
  products: ProductResponse[];
}) {
  const [values, setValues] = useState<OrderFormValues>(emptyValues);
  const totalPrice = products.find((p) => p.id === values?.product)?.price
    ? (
        Number(products.find((p) => p.id === values?.product)?.price) *
        values?.quantity
      ).toFixed(2)
    : "0.00";
  const productOptions = products?.map((product) => ({
    value: product.id,
    label: product.name,
  }));

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(values);
      }}
      className="space-y-4"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="space-y-1.5 text-sm font-medium text-ink-700">
          <span>Product</span>
          <select
            value={values.product}
            onChange={(e) =>
              setValues((current) => ({ ...current, product: e.target.value }))
            }
            className={inputClassName()}
            required
          >
            <option value="">Select a product</option>
            {productOptions?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
        <label className="space-y-1.5 text-sm font-medium text-ink-700">
          <span>Status</span>
          <select
            value={values.status}
            onChange={(e) =>
              setValues((current) => ({
                ...current,
                status: e.target.value as OrderStatus,
              }))
            }
            className={inputClassName()}
          >
            <option value="PENDING">Pending</option>
            <option value="FULFILLED">Fulfilled</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </label>
      </div>

      <label className="block space-y-1.5 text-sm font-medium text-ink-700">
        <span>Customer</span>
        <input
          value={values.customer}
          onChange={(e) =>
            setValues((current) => ({ ...current, customer: e.target.value }))
          }
          className={inputClassName()}
          placeholder="Acme Manufacturing Corp."
          required
        />
      </label>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="space-y-1.5 text-sm font-medium text-ink-700">
          <span>Quantity</span>
          <input
            type="number"
            min="1"
            value={values.quantity}
            onChange={(e) =>
              setValues((current) => ({
                ...current,
                quantity: Number(e.target.value),
              }))
            }
            className={inputClassName()}
            required
          />
        </label>
        <label className="space-y-1.5 text-sm font-medium text-ink-700">
          <span>Total</span>
          <input
            type="number"
            min="0"
            step="0.01"
            value={totalPrice}
            readOnly
            className={inputClassName()}
            required
          />
        </label>
      </div>

      <div className="flex flex-wrap items-center justify-end gap-2 pt-2">
        <Button variant="secondary" type="button" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">Create Order</Button>
      </div>
    </form>
  );
}

export function OrderFormModal({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { mutate, isPending } = useCreateOrder();
  const { data: products } = useGetAllProducts(1, 10);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingValues, setPendingValues] = useState<OrderFormValues | null>(
    null,
  );
  const productId =
    products
      .map((product) => product.id)
      .find((id) => id === pendingValues?.product) || "";

  const createOrder = () => {
    mutate(
      {
        items: [{ productId, quantity: pendingValues?.quantity ?? 0 }],
      },
      {
        onSuccess: () => {
          setConfirmOpen(false);
          onOpenChange(false);
          setPendingValues(null);
        },
      },
    );
  };

  if (!open) return null;
  return (
    <>
      <DashboardModal
        open={open}
        onOpenChange={onOpenChange}
        title="Create Order"
        description="Add a new order to the dashboard."
        widthClassName="max-w-2xl"
      >
        <OrderFormContent
          onCancel={() => onOpenChange(false)}
          onSubmit={(values) => {
            setPendingValues(values);
            setConfirmOpen(true);
          }}
          products={products}
        />
      </DashboardModal>

      <ConfirmModal
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="Confirm order creation"
        description={`Create order ${pendingValues?.product || "this order"} for ${pendingValues?.customer || "this customer"}?`}
        confirmLabel="Create Order"
        onConfirm={createOrder}
        loading={isPending}
      />
    </>
  );
}

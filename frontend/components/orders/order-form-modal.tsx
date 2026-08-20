"use client";

import { useState } from "react";

import toast from "react-hot-toast";

import { ConfirmModal, DashboardModal } from "@/components/dashboard/dashboard-modal";
import { Button } from "@/components/ui/button";
import type { OrderStatus } from "@/lib/data/types";

interface OrderFormValues {
  id: string;
  customer: string;
  items: string;
  total: string;
  status: OrderStatus;
}

const emptyValues: OrderFormValues = {
  id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
  customer: "",
  items: "",
  total: "",
  status: "PENDING",
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
}: {
  onSubmit: (values: OrderFormValues) => void;
  onCancel: () => void;
}) {
  const [values, setValues] = useState<OrderFormValues>(emptyValues);

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
          <span>Order ID</span>
          <input
            value={values.id}
            onChange={(e) => setValues((current) => ({ ...current, id: e.target.value }))}
            className={inputClassName()}
            required
          />
        </label>
        <label className="space-y-1.5 text-sm font-medium text-ink-700">
          <span>Status</span>
          <select
            value={values.status}
            onChange={(e) =>
              setValues((current) => ({ ...current, status: e.target.value as OrderStatus }))
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
          onChange={(e) => setValues((current) => ({ ...current, customer: e.target.value }))}
          className={inputClassName()}
          placeholder="Acme Manufacturing Corp."
          required
        />
      </label>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="space-y-1.5 text-sm font-medium text-ink-700">
          <span>Items</span>
          <input
            type="number"
            min="1"
            value={values.items}
            onChange={(e) => setValues((current) => ({ ...current, items: e.target.value }))}
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
            value={values.total}
            onChange={(e) => setValues((current) => ({ ...current, total: e.target.value }))}
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
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingValues, setPendingValues] = useState<OrderFormValues | null>(null);

  function createOrder() {
    toast.success(`Created order ${pendingValues?.id ?? ""}`);
    setConfirmOpen(false);
    onOpenChange(false);
    setPendingValues(null);
  }

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
        />
      </DashboardModal>

      <ConfirmModal
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="Confirm order creation"
        description={`Create order ${pendingValues?.id || "this order"} for ${pendingValues?.customer || "this customer"}?`}
        confirmLabel="Create Order"
        onConfirm={createOrder}
      />
    </>
  );
}

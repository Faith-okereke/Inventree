"use client";

import { useState } from "react";

import type { ProductMutationInput } from "@/api/services/product.service";
import { useCreateProduct, useUpdateProduct } from "@/api/hooks/useProducts";
import {
  ConfirmModal,
  DashboardModal,
} from "@/components/dashboard/dashboard-modal";
import { Button } from "@/components/ui/button";
import type { ProductResponse } from "@/lib/data/types";

const emptyValues: ProductMutationInput = {
  sku: "",
  name: "",
  description: "",
  price: 0,
  quantityInStock: 0,
  image: "",
};

function inputClassName() {
  return [
    "h-10 w-full rounded-lg border border-ink-200 bg-white px-3 text-sm text-ink-900",
    "transition-[border-color,box-shadow] duration-200 ease-out-soft",
    "placeholder:text-ink-400 hover:border-ink-300 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20",
  ].join(" ");
}

function ProductFormContent({
  product,
  onSubmit,
  onCancel,
}: {
  product?: ProductResponse;
  onSubmit: (values: ProductMutationInput) => void;
  onCancel: () => void;
}) {
  const [values, setValues] = useState<ProductMutationInput>(
    product
      ? {
          sku: product.sku,
          name: product.name,
          description: product.description,
          price: Number(product.price),
          quantityInStock: Number(product.quantityInStock),
          image: product.image,
        }
      : emptyValues,
  );

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(values);
      }}
      className="space-y-4 z-100"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="space-y-1.5 text-sm font-medium text-ink-700">
          <span>SKU</span>
          <input
            value={values.sku}
            onChange={(e) =>
              setValues((current) => ({ ...current, sku: e.target.value }))
            }
            className={inputClassName()}
            placeholder="WM-1001"
            required
          />
        </label>
        <label className="space-y-1.5 text-sm font-medium text-ink-700">
          <span>Name</span>
          <input
            value={values.name}
            onChange={(e) =>
              setValues((current) => ({ ...current, name: e.target.value }))
            }
            className={inputClassName()}
            placeholder="Wireless Mouse"
            required
          />
        </label>
      </div>

      <label className="block space-y-1.5 text-sm font-medium text-ink-700">
        <span>Description</span>
        <textarea
          value={values.description}
          onChange={(e) =>
            setValues((current) => ({
              ...current,
              description: e.target.value,
            }))
          }
          className="min-h-28 w-full rounded-lg border border-ink-200 bg-white px-3 py-2.5 text-sm text-ink-900 transition-[border-color,box-shadow] duration-200 ease-out-soft placeholder:text-ink-400 hover:border-ink-300 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
          placeholder="Product details"
          required
        />
      </label>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="space-y-1.5 text-sm font-medium text-ink-700">
          <span>Price</span>
          <input
            type="number"
            step="0.01"
            min="0"
            value={values.price}
            onChange={(e) =>
              setValues((current) => ({
                ...current,
                price: Number(e.target.value),
              }))
            }
            className={inputClassName()}
            placeholder="29.99"
            required
          />
        </label>
        <label className="space-y-1.5 text-sm font-medium text-ink-700">
          <span>Stock</span>
          <input
            type="number"
            min="0"
            value={values.quantityInStock}
            onChange={(e) =>
              setValues((current) => ({
                ...current,
                quantityInStock: Number(e.target.value),
              }))
            }
            className={inputClassName()}
            placeholder="120"
            required
          />
        </label>
      </div>

      <label className="block space-y-1.5 text-sm font-medium text-ink-700">
        <span>Image URL</span>
        <input
          value={values.image}
          onChange={(e) =>
            setValues((current) => ({ ...current, image: e.target.value }))
          }
          className={inputClassName()}
          placeholder="https://..."
          required
        />
      </label>

      <div className="flex flex-wrap items-center justify-end gap-2 pt-2">
        <Button variant="secondary" type="button" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {product ? "Save Changes" : "Create Product"}
        </Button>
      </div>
    </form>
  );
}

function toProductPayload(values: ProductMutationInput): ProductMutationInput {
  return {
    sku: values.sku.trim(),
    name: values.name.trim(),
    description: values.description.trim(),
    price: Number(values.price),
    quantityInStock: Number(values.quantityInStock),
    image: values.image.trim() || "https://placehold.co/80x80",
  };
}

export function ProductFormModal({
  open,
  onOpenChange,
  product,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product?: ProductResponse;
}) {
  const isEdit = Boolean(product);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingValues, setPendingValues] = useState<ProductMutationInput | null>(
    null,
  );
  const { mutate: create, isPending: loadCreate } = useCreateProduct();
  const { mutate: edit, isPending: loadEdit } = useUpdateProduct(product?.id);

  if (!open) return null;

  return (
    <>
      <DashboardModal
        open={open}
        onOpenChange={onOpenChange}
        title={isEdit ? "Edit Product" : "Create Product"}
        description={
          isEdit
            ? "Update the product details below."
            : "Add a new product to the registry."
        }
      >
        <ProductFormContent
          product={product}
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
        title={isEdit ? "Confirm product update" : "Confirm product creation"}
        description={
          isEdit
            ? `Apply the changes to ${product?.name ?? "this product"}?`
            : `Create ${pendingValues?.name || "this product"} in the registry?`
        }
        confirmLabel={isEdit ? "Save Changes" : "Create Product"}
        loading={isEdit ? loadEdit : loadCreate}
        onConfirm={() => {
          const payload = toProductPayload(pendingValues ?? emptyValues);
          const closeModal = () => {
            setConfirmOpen(false);
            onOpenChange(false);
            setPendingValues(null);
          };

          if (isEdit) {
            edit(payload, { onSuccess: closeModal });
          } else {
            create(payload, { onSuccess: closeModal });
          }
        }}
      />
    </>
  );
}

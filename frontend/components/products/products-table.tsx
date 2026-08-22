/* eslint-disable @next/next/no-img-element */
"use client";

import { createPortal } from "react-dom";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";

import { ConfirmModal } from "@/components/dashboard/dashboard-modal";
import { ProductFormModal } from "@/components/products/product-form-modal";
import { icons } from "@/components/ui/app-icon";
import { IconButton } from "@/components/ui/icon-button";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableEmpty,
  TableScroll,
  Td,
  Th,
  Tr,
} from "@/components/ui/table";
import { filterProducts } from "@/lib/data/filters";
import type { ProductResponse } from "@/lib/data/types";
import { formatCurrency, formatNumber } from "@/lib/utils/format";
import { cn } from "@/lib/utils/cn";
import { useAppSelector } from "@/store/hooks";
import { useDeleteProducts } from "@/api/hooks/useProducts";
import { TableFooter } from "../dashboard/table-footer";
import type { Pagination } from "@/api/hooks/types";

const COLUMN_COUNT = 7;
const MENU_WIDTH = 280;

type MenuPosition = {
  top: number;
  left: number;
};

function stockTone(stock: number) {
  if (stock === 0) return "text-danger-600";
  if (stock <= 5) return "text-warn-600";
  return "text-ink-800";
}

function ProductActions({ product }: { product: ProductResponse }) {
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState<MenuPosition | null>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const { mutate: remove, isPending } = useDeleteProducts(product.id);

  function toggleMenu(event: React.MouseEvent<HTMLButtonElement>) {
    const trigger = event.currentTarget;
    const rect = trigger.getBoundingClientRect();
    const top = rect.bottom + 8;
    const preferredLeft = rect.right - MENU_WIDTH;
    const left = Math.max(
      16,
      Math.min(preferredLeft, window.innerWidth - MENU_WIDTH - 16),
    );

    setPosition({ top, left });
    setOpen((value) => !value);
  }

  useEffect(() => {
    if (!open) return;

    function onPointerDown(event: PointerEvent) {
      const target = event.target as Node;
      if (rootRef.current?.contains(target)) return;
      if (menuRef.current?.contains(target)) return;
      setOpen(false);
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    function closeOnViewportChange() {
      setOpen(false);
    }

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    window.addEventListener("scroll", closeOnViewportChange, true);
    window.addEventListener("resize", closeOnViewportChange);

    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("scroll", closeOnViewportChange, true);
      window.removeEventListener("resize", closeOnViewportChange);
    };
  }, [open]);

  return (
    <>
      <div ref={rootRef} className="relative flex justify-end">
        <IconButton
          icon={icons.moreVertical}
          label={`Open actions for ${product.name}`}
          onClick={toggleMenu}
          className={cn(
            "grid size-8 place-items-center rounded-lg text-ink-500",
            "transition-[background-color,color,transform] duration-200 ease-out-soft",
            "hover:bg-ink-100 hover:text-ink-800 active:scale-95",
          )}
        />
      </div>

      {open && position && typeof document !== "undefined"
        ? createPortal(
            <AnimatePresence>
              <motion.div
                ref={menuRef}
                initial={{ opacity: 0, y: -4, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -4, scale: 0.98 }}
                transition={{ duration: 0.16, ease: [0.22, 1, 0.36, 1] }}
                style={{
                  top: position.top,
                  left: position.left,
                  width: MENU_WIDTH,
                }}
                className="fixed z-[999] overflow-hidden rounded-xl border border-ink-200 bg-white p-1.5 shadow-2xl shadow-ink-900/15"
              >
                <button
                  type="button"
                  onClick={() => {
                    setOpen(false);
                    setEditOpen(true);
                  }}
                  className="flex w-full items-center rounded-lg px-4 py-2.5 text-left text-sm font-medium text-ink-700 transition-colors hover:bg-ink-100 hover:text-ink-900"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setOpen(false);
                    setDeleteOpen(true);
                  }}
                  className="flex w-full items-center rounded-lg px-4 py-2.5 text-left text-sm font-medium text-danger-600 transition-colors hover:bg-danger-50 hover:text-danger-700"
                >
                  Delete
                </button>
              </motion.div>
            </AnimatePresence>,
            document.body,
          )
        : null}

      <ProductFormModal
        open={editOpen}
        onOpenChange={setEditOpen}
        product={product}
      />

      <ConfirmModal
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title={`Delete ${product.name}?`}
        description="This action cannot be undone."
        confirmLabel={isPending ? "Deleting..." : "Delete"}
        danger
        loading={isPending}
        onConfirm={() => remove()}
      />
    </>
  );
}

export function ProductsTable({
  products,
  pagination,
}: {
  products: readonly ProductResponse[];
  pagination?: Pagination;
}) {
  const filters = useAppSelector((s) => s.filters.products);
  const filteredProducts = filterProducts(products, filters);

  return (
    <div className="pt-24">
      <Card className="animate-fade-up overflow-visible">
        <TableScroll className="max-h-[60vh] overflow-y-auto pb-6">
          <Table>
            <thead>
              <tr>
                <Th className="w-16">Image</Th>
                <Th>SKU</Th>
                <Th>Product Name</Th>
                <Th className="hidden md:table-cell">Description</Th>
                <Th className="text-right">Price</Th>
                <Th className="hidden text-right sm:table-cell">Stock</Th>
                <Th className="text-right">Action</Th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.length === 0 ? (
                <TableEmpty colSpan={COLUMN_COUNT}>
                  No products match the current filters.
                </TableEmpty>
              ) : (
                filteredProducts.map((product, index) => (
                  <Tr
                    key={product.id}
                    className="animate-fade-in"
                    style={{ animationDelay: `${index * 35}ms` }}
                  >
                    <Td>
                      <img
                        src={product.image}
                        alt={product.name}
                        width={40}
                        height={40}
                        className="rounded-lg object-cover"
                      />
                    </Td>
                    <Td className="whitespace-nowrap font-mono text-xs font-semibold text-ink-600">
                      {product.sku}
                    </Td>
                    <Td className="max-w-[22ch] font-medium text-ink-800 sm:max-w-none">
                      {product.name}
                    </Td>
                    <Td className="hidden whitespace-nowrap text-ink-500 md:table-cell">
                      {product.description}
                    </Td>
                    <Td className="whitespace-nowrap text-right font-semibold text-ink-900 tabular-nums">
                      {formatCurrency(Number(product.price))}
                    </Td>
                    <Td
                      className={cn(
                        "hidden text-right font-semibold tabular-nums sm:table-cell",
                        stockTone(product.quantityInStock),
                      )}
                    >
                      {formatNumber(product.quantityInStock)}
                    </Td>
                    <Td className="text-right">
                      <ProductActions product={product} />
                    </Td>
                  </Tr>
                ))
              )}
            </tbody>
          </Table>
        </TableScroll>
        {pagination && <TableFooter table="products" {...pagination} />}
      </Card>
    </div>
  );
}

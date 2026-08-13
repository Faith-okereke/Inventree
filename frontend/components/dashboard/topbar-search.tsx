"use client";

import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

import { AppIcon, icons } from "@/components/ui/app-icon";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setFilter, type TableId } from "@/store/slices/filters.slice";

/** Routes whose page renders a filterable table. */
const TABLE_BY_PATH: Record<string, TableId | undefined> = {
  "/products": "products",
  "/orders": "orders",
  "/users": "users",
};

/**
 * The one global search box. On a table route it *is* that table's `search`
 * filter — so it stays in sync with the store (and therefore survives a reload).
 * On any other route it holds a local draft and submitting takes you to
 * Products with the term applied.
 */
export function TopbarSearch() {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch();

  const table = TABLE_BY_PATH[pathname];
  const stored = useAppSelector((s) => s.filters[table ?? "products"].search);
  const [draft, setDraft] = useState("");

  const value = table ? stored : draft;

  function onChange(next: string) {
    if (table) {
      dispatch(setFilter({ table, patch: { search: next } }));
    } else {
      setDraft(next);
    }
  }

  function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (table) return; // already filtering live

    dispatch(setFilter({ table: "products", patch: { search: draft } }));
    router.push("/products");
  }

  return (
    <form
      role="search"
      onSubmit={onSubmit}
      className="relative min-w-0 flex-1 sm:max-w-md"
    >
      <AppIcon
        name={icons.search}
        className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-ink-400"
      />
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search products, SKUs…"
        aria-label="Search products and SKUs"
        className="h-9 w-full rounded-lg border border-ink-200 bg-ink-50 pr-3 pl-9 text-sm text-ink-900 transition-[background-color,border-color,box-shadow] duration-200 ease-out-soft placeholder:text-ink-400 hover:border-ink-300 focus:border-brand-500 focus:bg-white focus:ring-2 focus:ring-brand-500/25 focus:outline-none"
      />
    </form>
  );
}

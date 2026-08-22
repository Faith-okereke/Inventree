import {  OrderListResponse, ProductResponse, User } from "@/lib/data/types";
import type { TableFilters } from "@/store/slices/filters.slice";

/** Case-insensitive "any field contains" match. Empty query matches everything. */
function matches(fields: readonly string[], query: string) {
  const needle = query.trim().toLowerCase();
  if (!needle) return true;
  return fields.some((field) => field.toLowerCase().includes(needle));
}

/*
 * Pure predicates, kept out of the components so the same filter runs in the
 * toolbar (for Export) and in the table without the two drifting apart.
 */

export function filterOrders(rows: readonly OrderListResponse[], f: TableFilters) {
  return rows.filter(
    (order) =>
      matches([order.id, order.user.name], f.search) &&
      (f.status === "all" || order.status.toLowerCase() === f.status),
  );
}

export function filterProducts(rows: readonly ProductResponse[], f: TableFilters) {
  return rows.filter((product) => {
    const stockStatus =
      product.quantityInStock <= 0
        ? "out-of-stock"
        : product.quantityInStock <= 5
          ? "low-stock"
          : "in-stock";

    return (
      matches([product.sku, product.name, product.description], f.search) &&
      (f.status === "all" || f.status === stockStatus)
    );
  });
}

export function filterUsers(rows: readonly User[], f: TableFilters) {
  return rows.filter((user) => {
    const status = user.active ? "active" : "inactive";
    return (
      matches([user.name, user.email], f.search) &&
      (f.role === "all" || user.role.toLowerCase() === f.role) &&
      (f.status === "all" || status === f.status)
    );
  });
}

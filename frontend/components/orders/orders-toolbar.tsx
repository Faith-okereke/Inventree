"use client";

import { FilterPopover } from "@/components/dashboard/filter-popover";
import { AppIcon, icons } from "@/components/ui/app-icon";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { filterOrders } from "@/lib/data/filters";
import { orders } from "@/lib/data/orders";
import { downloadCsv, toCsv } from "@/lib/utils/csv";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setFilter } from "@/store/slices/filters.slice";

const statusOptions = [
  { value: "all", label: "All statuses" },
  { value: "pending", label: "Pending" },
  { value: "fulfilled", label: "Fulfilled" },
  { value: "cancelled", label: "Cancelled" },
] as const;

export function OrdersToolbar() {
  const filters = useAppSelector((s) => s.filters.orders);
  const dispatch = useAppDispatch();

  function exportCsv() {
    // Exports what the user is looking at, not the whole fixture set.
    const rows = filterOrders(orders, filters).map((order) => [
      order.id,
      order.date,
      order.customer,
      order.items,
      order.total,
      order.status,
    ]);

    downloadCsv(
      "orders.csv",
      toCsv(
        ["Order ID", "Date", "Customer Name", "Items", "Total", "Status"],
        rows,
      ),
    );
  }

  return (
    <>
      <FilterPopover activeCount={filters.status === "all" ? 0 : 1}>
        <Select
          id="orders-status-filter"
          label="Status"
          options={statusOptions}
          value={filters.status}
          onChange={(e) =>
            dispatch(
              setFilter({ table: "orders", patch: { status: e.target.value } }),
            )
          }
          className="mt-1"
        />
        <Button
          variant="ghost"
          size="sm"
          className="w-full"
          onClick={() =>
            dispatch(
              setFilter({ table: "orders", patch: { status: "all", search: "" } }),
            )
          }
        >
          Clear filters
        </Button>
      </FilterPopover>

      <Button variant="secondary" size="sm" className="h-9" onClick={exportCsv}>
        <AppIcon name={icons.export} className="size-4" />
        Export
      </Button>

      {/* The Figma set has no "create order" frame, so this opens nothing yet —
          it is the designed affordance, waiting on that screen. */}
      <Button size="sm" className="h-9">
        <AppIcon name={icons.plus} className="size-4" />
        Create Order
      </Button>
    </>
  );
}

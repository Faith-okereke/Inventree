"use client";

import { useMemo } from "react";

import { TableFooter } from "@/components/dashboard/table-footer";
import { StatusBadge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableEmpty,
  TableScroll,
  Td,
  Th,
  Tr,
} from "@/components/ui/table";
import { filterOrders } from "@/lib/data/filters";
import { orders } from "@/lib/data/orders";
import { paginate } from "@/lib/data/pagination";
import { formatCurrency, formatNumber } from "@/lib/utils/format";
import { useAppSelector } from "@/store/hooks";

const COLUMN_COUNT = 6;

export function OrdersTable() {
  const filters = useAppSelector((s) => s.filters.orders);

  // Filter + slice memoised on the two inputs that can change it, so typing in
  // the topbar search does not re-run the pass on unrelated re-renders.
  const view = useMemo(
    () => paginate(filterOrders(orders, filters), filters.page),
    [filters],
  );

  return (
    <Card className="animate-fade-up overflow-hidden">
      <TableScroll>
        <Table>
          <thead>
            <tr>
              <Th>Order ID</Th>
              <Th className="hidden md:table-cell">Date</Th>
              <Th>Customer Name</Th>
              <Th className="hidden sm:table-cell">Items</Th>
              <Th className="text-right">Total</Th>
              <Th>Status</Th>
            </tr>
          </thead>
          <tbody>
            {view.rows.length === 0 ? (
              <TableEmpty colSpan={COLUMN_COUNT}>
                No orders match the current filters.
              </TableEmpty>
            ) : (
              view.rows.map((order, index) => (
                <Tr
                  key={order.id}
                  className="animate-fade-in"
                  style={{ animationDelay: `${index * 35}ms` }}
                >
                  <Td className="font-semibold text-brand-700 whitespace-nowrap">
                    {order.id}
                  </Td>
                  <Td className="hidden text-ink-500 whitespace-nowrap md:table-cell">
                    {order.date}
                  </Td>
                  <Td className="font-medium text-ink-800">{order.customer}</Td>
                  <Td className="hidden tabular-nums sm:table-cell">
                    {formatNumber(order.items)}
                  </Td>
                  <Td className="text-right font-semibold text-ink-900 tabular-nums whitespace-nowrap">
                    {formatCurrency(order.total)}
                  </Td>
                  <Td>
                    <StatusBadge status={order.status} />
                  </Td>
                </Tr>
              ))
            )}
          </tbody>
        </Table>
      </TableScroll>

      <TableFooter
        table="orders"
        from={view.from}
        to={view.to}
        total={view.total}
        page={view.page}
        totalPages={view.totalPages}
      />
    </Card>
  );
}

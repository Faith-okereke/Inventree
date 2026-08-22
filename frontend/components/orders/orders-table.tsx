"use client";

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
import { formatCurrency, formatNumber } from "@/lib/utils/format";
import { useGetAllOrders } from "@/api/hooks/useOrders";

const COLUMN_COUNT = 6;

export function OrdersTable() {
  const { data: orders } = useGetAllOrders();

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
            {Array.isArray(orders) && orders.length === 0 ? (
              <TableEmpty colSpan={COLUMN_COUNT}>
                No orders match the current filters.
              </TableEmpty>
            ) : (
              orders.map((order, index) => {
                const quantity = order.orderItems.reduce(
                  (total, item) => total + item.quantity,
                  0,
                );
                const total = order.orderItems.reduce(
                  (sum, item) =>
                    sum + Number(item.priceAtOrder) * item.quantity,
                  0,
                );

                return (
                  <Tr
                    key={order.id}
                    className="animate-fade-in"
                    style={{ animationDelay: `${index * 35}ms` }}
                  >
                    <Td className="font-semibold text-brand-700 whitespace-nowrap">
                      {order.id}
                    </Td>
                    <Td className="hidden text-ink-500 whitespace-nowrap md:table-cell">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </Td>
                    <Td className="font-medium text-ink-800">
                      {order.user.name}
                    </Td>
                    <Td className="hidden tabular-nums sm:table-cell">
                      {formatNumber(quantity)}
                    </Td>
                    <Td className="text-right font-semibold text-ink-900 tabular-nums whitespace-nowrap">
                      {formatCurrency(total)}
                    </Td>
                    <Td>
                      <StatusBadge status={order.status} />
                    </Td>
                  </Tr>
                );
              })
            )}
          </tbody>
        </Table>
      </TableScroll>
    </Card>
  );
}

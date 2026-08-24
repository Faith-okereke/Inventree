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
import type { OrderListResponse } from "@/lib/data/types";
import { useGetAllOrders } from "@/api/hooks/useOrders";
import { TableFooter } from "@/components/dashboard/table-footer";
import { useAppSelector } from "@/store/hooks";
import { useState } from "react";
import { IconButton } from "@/components/ui/icon-button";
import { icons } from "@/components/ui/app-icon";
import { OrderDetailsModal } from "@/components/orders/order-details-modal";

const COLUMN_COUNT = 7;

export function OrdersTable() {
  const [selectedOrder, setSelectedOrder] = useState<OrderListResponse | null>(null);
  const filters = useAppSelector((s) => s.filters.orders);
  const { data: orders, pagination } = useGetAllOrders(
    filters.page,
    10,
    filters.status,
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
              <Th className="text-right">Actions</Th>
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
                    <Td className="text-right">
                      <IconButton
                        icon={icons.eye}
                        label={`View order ${order.id}`}
                        onClick={() => setSelectedOrder(order)}
                      />
                    </Td>
                  </Tr>
                );
              })
            )}
          </tbody>
        </Table>
      </TableScroll>
      {pagination && <TableFooter table="orders" {...pagination} />}
      {selectedOrder && (
        <OrderDetailsModal
          order={selectedOrder}
          open={Boolean(selectedOrder)}
          onOpenChange={(open) => {
            if (!open) setSelectedOrder(null);
          }}
        />
      )}
    </Card>
  );
}

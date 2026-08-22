"use client";

import { useGetAllOrders } from "@/api/hooks/useOrders";
import { useGetAllProducts } from "@/api/hooks/useProducts";
import { LowStockTable } from "@/components/dashboard/low-stock-table";
import { OrderStatusChart } from "@/components/dashboard/order-status-chart";
import { PageHeader } from "@/components/dashboard/page-header";
import { StatCard, StatGrid } from "@/components/dashboard/stat-card";
import { TopProductsChart } from "@/components/dashboard/top-products-chart";
import { icons } from "@/components/ui/app-icon";
import { formatCurrency } from "@/lib/utils/format";

export function DashboardPageClient() {
  const { data: orders, isLoading: ordersLoading } = useGetAllOrders();
  const { data: products, isLoading: productsLoading } = useGetAllProducts();
  const isLoading = ordersLoading || productsLoading;
  const totalRevenue = orders.reduce(
    (total, order) =>
      total +
      order.orderItems.reduce(
        (orderTotal, item) =>
          orderTotal + Number(item.priceAtOrder) * item.quantity,
        0,
      ),
    0,
  );
  const pendingOrders = orders.filter(
    (order) => order.status === "pending",
  ).length;
  const lowStockProducts = products.filter(
    (product) => product.quantityInStock <= 5,
  );
  const outOfStockCount = products.filter(
    (product) => product.quantityInStock <= 0,
  ).length;

  return (
    <>
      <PageHeader
        title="Overview"
        subtitle="Real-time inventory metrics and order status."
      />
      <StatGrid>
        <StatCard
          index={0}
          label="Total Orders"
          value={isLoading ? "..." : String(orders.length)}
          icon={icons.receipt}
        />
        <StatCard
          index={1}
          label="Total Revenue"
          value={isLoading ? "..." : formatCurrency(totalRevenue)}
          icon={icons.wallet}
        />
        <StatCard
          index={2}
          label="Pending Fulfillments"
          value={isLoading ? "..." : String(pendingOrders)}
          delta="Requires attention"
          deltaTone="warn"
          icon={icons.truck}
        />
        <StatCard
          index={3}
          label="Low Stock Items"
          value={isLoading ? "..." : String(lowStockProducts.length)}
          delta={outOfStockCount > 0 ? `${outOfStockCount} out of stock` : ""}
          deltaTone="danger"
          icon={icons.alert}
        />
      </StatGrid>
      <div className="grid gap-4 lg:grid-cols-2">
        <OrderStatusChart orders={orders} />
        <TopProductsChart orders={orders} />
      </div>
      <LowStockTable products={lowStockProducts} />
    </>
  );
}

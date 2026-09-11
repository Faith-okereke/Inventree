"use client";

import { useGetDashboard } from "@/api-services/hooks/useDashboard";
import { LowStockTable } from "@/components/dashboard/low-stock-table";
import { OrderStatusChart } from "@/components/dashboard/order-status-chart";
import { PageHeader } from "@/components/dashboard/page-header";
import { RevenueHero } from "@/components/dashboard/revenue-hero";
import { StatCard, StatGrid } from "@/components/dashboard/stat-card";
import { TopProductsChart } from "@/components/dashboard/top-products-chart";
import { icons } from "@/components/ui/app-icon";
import { formatCurrency } from "@/lib/utils/format";

export function DashboardPageClient() {
  const { data, isLoading } = useGetDashboard();

  const totalOrders = data?.summary.totalOrders ?? 0;
  const totalRevenue = data?.summary.totalRevenue ?? 0;
  const pendingOrders = data?.ordersByStatus.pending ?? 0;
  const fulfilledOrders = data?.ordersByStatus.fulfilled ?? 0;
  const lowStockProducts = data?.lowStockProducts ?? [];
  const outOfStockCount =
    data?.lowStockProducts.filter((product) => product.quantityInStock <= 0)
      .length ?? 0;

  return (
    <>
      <PageHeader
        title="Overview"
        subtitle="Real-time inventory metrics and order status."
      />

      <RevenueHero
        value={formatCurrency(totalRevenue)}
        orders={totalOrders}
        fulfilled={fulfilledOrders}
        isLoading={isLoading}
      />

      {/* Three supporting metrics — deliberately lighter than the hero above. */}
      <StatGrid columns={3}>
        <StatCard
          index={0}
          label="Total Orders"
          value={isLoading ? "—" : String(totalOrders)}
          accent="brand"
          icon={icons.receipt}
        />
        <StatCard
          index={1}
          label="Pending Fulfillments"
          value={isLoading ? "—" : String(pendingOrders)}
          delta={pendingOrders > 0 ? "Requires attention" : ""}
          deltaTone="warn"
          accent="warn"
          icon={icons.truck}
        />
        <StatCard
          index={2}
          label="Low Stock Items"
          value={isLoading ? "—" : String(lowStockProducts.length)}
          delta={outOfStockCount > 0 ? `${outOfStockCount} out of stock` : ""}
          deltaTone="danger"
          accent="danger"
          icon={icons.alert}
        />
      </StatGrid>

      <div className="grid gap-4 lg:grid-cols-2">
        <OrderStatusChart
          ordersByStatus={data?.ordersByStatus ?? {}}
          total={totalOrders}
        />
        <TopProductsChart products={data?.topProducts ?? []} />
      </div>

      <LowStockTable products={lowStockProducts} />
    </>
  );
}

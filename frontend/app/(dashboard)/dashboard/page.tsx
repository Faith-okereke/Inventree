import type { Metadata } from "next";

import { LowStockTable } from "@/components/dashboard/low-stock-table";
import { OrderStatusChart } from "@/components/dashboard/order-status-chart";
import { PageHeader } from "@/components/dashboard/page-header";
import { StatCard, StatGrid } from "@/components/dashboard/stat-card";
import { TopProductsChart } from "@/components/dashboard/top-products-chart";
import { overviewStats } from "@/lib/data/dashboard";
import type { IconName } from "@/components/ui/app-icon";

export const metadata: Metadata = {
  title: "Overview",
  description: "Real-time inventory metrics and order status.",
};

/**
 * Server Component, fully static. Every child here is a Server Component too —
 * the whole page prerenders to HTML at build time and hydrates nothing beyond the
 * shared shell (sidebar, topbar).
 */
export default function DashboardPage() {
  return (
    <>
      <PageHeader
        title="Overview"
        subtitle="Real-time inventory metrics and order status."
      />

      <StatGrid>
        {overviewStats.map((stat, index) => (
          <StatCard
            key={stat.label}
            index={index}
            label={stat.label}
            value={stat.value}
            delta={stat.delta}
            deltaTone={stat.deltaTone}
            icon={stat.icon as IconName}
          />
        ))}
      </StatGrid>

      <div className="grid gap-4 lg:grid-cols-2">
        <OrderStatusChart />
        <TopProductsChart />
      </div>

      <LowStockTable />
    </>
  );
}

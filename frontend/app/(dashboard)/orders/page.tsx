import type { Metadata } from "next";

import { PageHeader } from "@/components/dashboard/page-header";
import { OrdersTable } from "@/components/orders/orders-table";
import { OrdersToolbar } from "@/components/orders/orders-toolbar";

export const metadata: Metadata = {
  title: "Orders List",
  description: "View the list of customer orders and their fulfilment status.",
};

export default function OrdersPage() {
  return (
    <>
      <PageHeader title="Orders List" subtitle="View List of Orders">
        <OrdersToolbar />
      </PageHeader>

      <OrdersTable />
    </>
  );
}

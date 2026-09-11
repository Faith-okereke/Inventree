import type { Metadata } from "next";

import { DashboardPageClient } from "@/components/dashboard/dashboard-page-client";

export const metadata: Metadata = {
  title: "Overview",
  description: "Real-time inventory metrics and order status.",
};


export default function DashboardPage() {
  return (
    <DashboardPageClient />
  );
}

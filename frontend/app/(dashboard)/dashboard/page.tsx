import type { Metadata } from "next";

import { DashboardPageClient } from "@/components/dashboard/dashboard-page-client";

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
    <DashboardPageClient />
  );
}

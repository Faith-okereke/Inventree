"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { DesktopSidebar, MobileSidebar } from "@/components/dashboard/sidebar";
import { Topbar } from "@/components/dashboard/topbar";
import { loadAuthSession } from "@/lib/auth/session";
import { useAppSelector } from "@/store/hooks";
import { StoreProvider } from "@/store/store-provider";

function DashboardAuthGuard() {
  const router = useRouter();
  const token = useAppSelector((state) => state.auth.token);

  useEffect(() => {
    const hasToken = Boolean(token || loadAuthSession()?.token);
    if (!hasToken) {
      router.replace("/login");
    }
  }, [router, token]);

  return null;
}


export default function DashboardLayout({ children }: LayoutProps<"/">) {
  return (
    <StoreProvider>
      <DashboardAuthGuard />
      <div className="flex min-h-dvh items-start">
        <DesktopSidebar />
        <MobileSidebar />

        <div className="flex min-h-dvh min-w-0 flex-1 flex-col">
          <Topbar />
          <main className="min-h-0 flex-1 space-y-5 overflow-y-auto p-4 sm:p-6">
            {children}
          </main>
        </div>
      </div>
    </StoreProvider>
  );
}

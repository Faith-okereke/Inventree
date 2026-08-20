"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect } from "react";

import { AppIcon, icons } from "@/components/ui/app-icon";
import { Logo } from "@/components/brand/logo";
import { NavLink } from "@/components/dashboard/nav-link";
import { primaryNav, secondaryNav } from "@/components/dashboard/nav-config";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setMobileNavOpen, toggleSidebar } from "@/store/slices/ui.slice";
import { cn } from "@/lib/utils/cn";
import { clearAuth } from "@/store/slices/auth.slice";
import { clearAuthSession } from "@/lib/auth/session";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

function NavSections({
  collapsed,
  onNavigate,
}: {
  collapsed?: boolean;
  onNavigate?: () => void;
}) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const logout = () => {
    clearAuthSession();
    dispatch(clearAuth());
    toast.success("Logout successful. Login to access your account");
    router.push("/login");
  };

  return (
    <>
      <nav
        aria-label="Main"
        className="min-h-0 flex-1 space-y-1 overflow-y-auto px-3"
      >
        {primaryNav.map((item) => (
          <NavLink
            key={item.href}
            item={item}
            collapsed={collapsed}
            onNavigate={onNavigate}
          />
        ))}
      </nav>

      <div className="space-y-1 border-t border-ink-200 px-3 pt-3">
        {secondaryNav.map((item) => (
          <button
            key={item.label}
            type="button"
            title={collapsed ? item.label : undefined}
            onClick={() => logout()}
            className={cn(
              "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-ink-600",
              "transition-colors duration-200 ease-out-soft hover:bg-ink-100 hover:text-ink-900",
              collapsed && "justify-center px-2",
            )}
          >
            <AppIcon name={item.icon} className="size-5" />
            {!collapsed && item.label}
          </button>
        ))}
      </div>
    </>
  );
}

export function DesktopSidebar() {
  const collapsed = useAppSelector((s) => s.ui.sidebarCollapsed);
  const dispatch = useAppDispatch();

  return (
    <aside
      className={cn(
        "hidden shrink-0 flex-col gap-4 border-r border-ink-200 bg-white py-5 lg:flex",
        "sticky top-0 h-dvh",
        "transition-[width] duration-300 ease-out-soft",
        collapsed ? "w-[76px]" : "w-64",
      )}
    >
      <div
        className={cn(
          "flex items-center px-4",
          collapsed ? "justify-center" : "justify-between",
        )}
      >
        {!collapsed && (
          <div className="min-w-0">
            <Logo tight />
            <p className="mt-0.5 truncate text-[10px] font-semibold tracking-wider text-ink-500 uppercase">
              Industrial Inventory
            </p>
          </div>
        )}
        <button
          type="button"
          onClick={() => dispatch(toggleSidebar())}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          aria-expanded={!collapsed}
          className="grid size-8 shrink-0 place-items-center rounded-md text-ink-500 transition-colors duration-150 hover:bg-ink-100 hover:text-ink-800"
        >
          <AppIcon name={icons.panelLeft} className="size-4.5" />
        </button>
      </div>

      <NavSections collapsed={collapsed} />
    </aside>
  );
}

/** Slide-over drawer below `lg`. */
export function MobileSidebar() {
  const open = useAppSelector((s) => s.ui.mobileNavOpen);
  const dispatch = useAppDispatch();
  const close = () => dispatch(setMobileNavOpen(false));

  // Escape to dismiss, and lock body scroll while the drawer covers the page.
  useEffect(() => {
    if (!open) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") dispatch(setMobileNavOpen(false));
    };
    document.addEventListener("keydown", onKey);

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, dispatch]);

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={close}
            className="absolute inset-0 bg-ink-900/40 backdrop-blur-sm"
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Navigation"
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            // Spring rather than a duration — reads as physical, and interrupting
            // it mid-flight (open → close fast) stays smooth instead of snapping.
            transition={{ type: "spring", stiffness: 420, damping: 38 }}
            className="absolute inset-y-0 left-0 flex w-72 max-w-[82vw] flex-col gap-4 border-r border-ink-200 bg-white py-5"
          >
            <div className="flex items-center justify-between px-4">
              <div className="min-w-0">
                <Logo tight />
                <p className="mt-0.5 truncate text-[10px] font-semibold tracking-wider text-ink-500 uppercase">
                  Industrial Inventory
                </p>
              </div>
              <button
                type="button"
                onClick={close}
                aria-label="Close navigation"
                className="grid size-8 place-items-center rounded-md text-ink-500 transition-colors duration-150 hover:bg-ink-100 hover:text-ink-800"
              >
                <AppIcon name={icons.close} className="size-5" />
              </button>
            </div>

            <NavSections onNavigate={close} />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

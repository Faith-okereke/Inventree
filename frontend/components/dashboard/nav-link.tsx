"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { memo } from "react";

import { AppIcon } from "@/components/ui/app-icon";
import { cn } from "@/lib/utils/cn";
import type { NavItem } from "@/components/dashboard/nav-config";

export const NavLink = memo(function NavLink({
  item,
  collapsed,
  onNavigate,
}: {
  item: NavItem;
  collapsed?: boolean;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  const active = pathname === item.href || pathname.startsWith(`${item.href}/`);

  return (
    <Link
      href={item.href}
      onClick={onNavigate}
      aria-current={active ? "page" : undefined}
      title={collapsed ? item.label : undefined}
      className={cn(
        "group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium",
        "transition-[background-color,color] duration-200 ease-out-soft",
        collapsed && "justify-center px-2",
        active
          ? "bg-brand-50 text-brand-700"
          : "text-ink-600 hover:bg-ink-100 hover:text-ink-900",
      )}
    >
      {/* Active rail marker */}
      <span
        aria-hidden
        className={cn(
          "absolute top-1/2 left-0 h-6 w-0.5 -translate-y-1/2 rounded-r-full bg-brand-600",
          "transition-opacity duration-200 ease-out-soft",
          active ? "opacity-100" : "opacity-0",
        )}
      />
      <AppIcon name={item.icon} className="size-5" />
      {!collapsed && <span className="truncate">{item.label}</span>}
    </Link>
  );
});

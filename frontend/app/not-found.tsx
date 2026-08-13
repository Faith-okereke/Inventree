import Link from "next/link";
import type { Metadata } from "next";

import { Logo } from "@/components/brand/logo";
import { AppIcon, icons } from "@/components/ui/app-icon";

export const metadata: Metadata = {
  title: "Page not found",
};

const suggestions = [
  { href: "/dashboard", label: "Overview", icon: icons.dashboard },
  { href: "/products", label: "Products Registry", icon: icons.products },
  { href: "/orders", label: "Orders List", icon: icons.orders },
  { href: "/users", label: "User Management", icon: icons.users },
] as const;

/**
 * Rendered for any unmatched path, and for any `notFound()` call that no nested
 * boundary handles. Server Component — no JS ships for this route.
 */
export default function NotFound() {
  return (
    <main className="flex flex-1 items-center justify-center bg-ink-100 px-4 py-16">
      <div className="animate-fade-up w-full max-w-lg text-center">
        <Logo className="mx-auto" />

        <p className="mt-10 text-6xl font-black tracking-tighter text-brand-600 tabular-nums sm:text-7xl">
          404
        </p>
        <h1 className="mt-3 text-xl font-bold text-ink-900 sm:text-2xl">
          We couldn&apos;t find that page
        </h1>
        <p className="mx-auto mt-2 max-w-sm text-sm text-ink-500">
          The link may be out of date, or the record it pointed at is no longer
          in the registry.
        </p>

        <div className="mt-7 flex flex-wrap justify-center gap-2">
          <Link
            href="/dashboard"
            className="inline-flex h-10 items-center gap-2 rounded-lg bg-brand-600 px-4 text-sm font-semibold text-white shadow-sm transition-[background-color,transform] duration-200 ease-out-soft hover:bg-brand-700 active:scale-[0.98]"
          >
            <AppIcon name={icons.dashboard} className="size-4" />
            Back to Overview
          </Link>
        </div>

        <nav
          aria-label="Suggested pages"
          className="stagger-children mt-10 grid grid-cols-1 gap-2 text-left sm:grid-cols-2"
        >
          {suggestions.map((item, index) => (
            <Link
              key={item.href}
              href={item.href}
              style={{ "--stagger-index": index + 1 } as React.CSSProperties}
              className="flex items-center gap-3 rounded-xl border border-ink-200 bg-white px-4 py-3 text-sm font-medium text-ink-700 transition-[border-color,box-shadow,transform] duration-200 ease-out-soft hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-sm"
            >
              <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-brand-50 text-brand-600">
                <AppIcon name={item.icon} className="size-4" />
              </span>
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </main>
  );
}

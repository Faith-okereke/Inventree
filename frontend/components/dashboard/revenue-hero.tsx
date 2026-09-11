import { AppIcon, icons } from "@/components/ui/app-icon";
import { formatNumber } from "@/lib/utils/format";

export function RevenueHero({
  value,
  orders,
  fulfilled,
  isLoading,
}: {
  value: string;
  orders: number;
  fulfilled: number;
  isLoading: boolean;
}) {
  return (
    <section className="animate-fade-up relative isolate overflow-hidden rounded-xl bg-brand-600 p-6 shadow-sm sm:p-8">

      <span
        aria-hidden
        className="pointer-events-none absolute -top-28 -right-20 -z-10 size-80 rounded-full opacity-50 blur-3xl"
        style={{
          background:
            "radial-gradient(circle, var(--color-brand-400), transparent 70%)",
        }}
      />

      <div className="flex flex-wrap items-start justify-between gap-6">
        <div className="min-w-0">
          <p className="text-[11px] font-semibold tracking-wider text-brand-100 uppercase">
            Total Revenue
          </p>
          <p className="mt-3 text-4xl font-bold tracking-tight text-white tabular-nums sm:text-5xl">
            {isLoading ? "—" : value}
          </p>

          <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
            <span className="text-brand-100">
              across{" "}
              <span className="font-semibold text-white tabular-nums">
                {isLoading ? "—" : formatNumber(orders)}
              </span>{" "}
              orders
            </span>
            <span className="flex items-center gap-2 text-brand-100">
              <span
                aria-hidden
                className="size-1.5 rounded-full bg-success-500"
              />
              <span className="font-semibold text-white tabular-nums">
                {isLoading ? "—" : formatNumber(fulfilled)}
              </span>{" "}
              fulfilled
            </span>
          </div>
        </div>

        <span
          aria-hidden
          className="grid size-12 shrink-0 place-items-center rounded-xl bg-white/15 text-white"
        >
          <AppIcon name={icons.wallet} className="size-6" />
        </span>
      </div>
    </section>
  );
}

import { cn } from "@/lib/utils/cn";

/** Wordmark. `tight` is the compact form used in the sidebar. */
export function Logo({
  className,
  tight = false,
}: {
  className?: string;
  tight?: boolean;
}) {
  return (
    <span
      className={cn(
        "font-extrabold tracking-tight text-brand-600 select-none",
        tight ? "text-xl" : "text-2xl tracking-[0.08em] uppercase",
        className,
      )}
    >
      {tight ? (
        <>
          Inven<span className="text-brand-800">Tree</span>
        </>
      ) : (
        "Inventree"
      )}
    </span>
  );
}

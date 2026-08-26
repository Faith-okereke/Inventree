"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useId, useRef, useState } from "react";

import { AppIcon, icons } from "@/components/ui/app-icon";
import { cn } from "@/lib/utils/cn";

export interface FilterPopoverProps {
  label?: string;
  /** Shown as a pill on the trigger when filters are narrowing the table. */
  activeCount?: number;
  children: React.ReactNode;
}

/**
 * Reusable disclosure for table filters. Dismisses on outside click and Escape,
 * and returns focus to the trigger so keyboard users are not stranded.
 */
export function FilterPopover({
  label = "Filter",
  activeCount = 0,
  children,
}: FilterPopoverProps) {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  function closePopover() {
    setOpen(false);
    triggerRef.current?.focus();
  }

  useEffect(() => {
    if (!open) return;

    function onPointerDown(event: PointerEvent) {
      if (rootRef.current?.contains(event.target as Node)) return;
      closePopover();
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key !== "Escape") return;
      closePopover();
    }

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="relative z-20">
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-controls={panelId}
        className={cn(
          "inline-flex h-9 items-center gap-2 rounded-lg border px-3 text-xs font-semibold whitespace-nowrap",
          "transition-[background-color,border-color,color] duration-200 ease-out-soft",
          open || activeCount > 0
            ? "border-brand-300 bg-brand-50 text-brand-700"
            : "border-ink-200 bg-white text-ink-700 hover:border-ink-300 hover:bg-ink-50",
        )}
      >
        <AppIcon name={icons.filter} className="size-4" />
        {label}
        {activeCount > 0 && (
          <span className="grid size-4.5 place-items-center rounded-full bg-brand-600 text-[10px] text-white">
            {activeCount}
          </span>
        )}
        <AppIcon
          name={icons.chevronDown}
          className={cn(
            "size-3.5 transition-transform duration-200 ease-out-soft",
            open && "rotate-180",
          )}
        />
      </button>

      <AnimatePresence>
        {open && (
          <>
            <motion.button
              aria-hidden="true"
              tabIndex={-1}
              type="button"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              onClick={closePopover}
              className="fixed inset-0 z-70 cursor-default bg-ink-950/15 backdrop-blur-[1px]"
            />
            <motion.div
              id={panelId}
              initial={{ opacity: 0, y: -6, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -6, scale: 0.97 }}
              transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
              className="absolute top-full right-0 z-70 mt-2 w-60 origin-top-right space-y-3 rounded-xl border border-ink-200 bg-white p-3.5 shadow-xl shadow-ink-900/10"
            >
              {children}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}


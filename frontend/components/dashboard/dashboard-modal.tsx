﻿"use client";

import { createPortal } from "react-dom";
import { useEffect } from "react";

import { AnimatePresence, motion } from "motion/react";

import { AppIcon, icons } from "@/components/ui/app-icon";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";

export interface DashboardModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
  widthClassName?: string;
}

export function DashboardModal({
  open,
  onOpenChange,
  title,
  description,
  children,
  className,
  widthClassName = "max-w-xl",
}: DashboardModalProps) {
  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onOpenChange(false);
    }

    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, onOpenChange]);

  if (!open || typeof document === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-1000 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <button
          type="button"
          aria-label="Close modal"
          onClick={() => onOpenChange(false)}
          className="absolute inset-0 cursor-default bg-ink-950/35 backdrop-blur-sm"
        />

        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label={title}
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
          className={cn(
            "relative w-full overflow-hidden rounded-2xl border border-ink-200 bg-white shadow-2xl shadow-ink-950/20",
            widthClassName,
            className,
          )}
        >
          <div className="flex items-start justify-between gap-4 border-b border-ink-200 px-5 py-4">
            <div className="min-w-0 flex-1">
              <h2 className="text-base font-semibold text-ink-900">{title}</h2>
              {description && (
                <p className="mt-1 text-sm text-ink-500">{description}</p>
              )}
            </div>

            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="grid size-8 place-items-center rounded-lg text-ink-500 transition-colors hover:bg-ink-100 hover:text-ink-800"
              aria-label="Close"
            >
              <AppIcon name={icons.close} className="size-4.5" />
            </button>
          </div>

          <div className="max-h-[75vh] overflow-y-auto px-5 py-5">{children}</div>
        </motion.div>
      </motion.div>
    </AnimatePresence>,
    document.body,
  );
}

export interface ConfirmModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  danger?: boolean;
  loading?: boolean;
  onConfirm: () => void | Promise<void>;
}

export function ConfirmModal({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  danger = false,
  loading = false,
  onConfirm,
}: ConfirmModalProps) {
  return (
    <DashboardModal
      open={open}
      onOpenChange={onOpenChange}
      title={title}
      description={description}
      widthClassName="max-w-md"
    >
      <div className="flex flex-wrap items-center justify-end gap-3">
        <Button
          variant="secondary"
          type="button"
          onClick={() => onOpenChange(false)}
        >
          {cancelLabel}
        </Button>
        <Button
          variant={danger ? "danger" : "primary"}
          type="button"
          disabled={loading}
          onClick={onConfirm}
        >
          {loading ? "Working..." : confirmLabel}
        </Button>
      </div>
    </DashboardModal>
  );
}

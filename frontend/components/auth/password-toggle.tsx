"use client";

import { useState } from "react";

import { AppIcon, icons } from "@/components/ui/app-icon";

/** Eye toggle rendered inside the password field. */
export function PasswordToggle({
  visible,
  onToggle,
}: {
  visible: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={visible ? "Hide password" : "Show password"}
      aria-pressed={visible}
      className="grid size-8 place-items-center rounded-md text-ink-500 transition-colors duration-150 hover:bg-ink-300/50 hover:text-ink-700"
    >
      <AppIcon name={visible ? icons.eyeOff : icons.eye} className="size-4.5" />
    </button>
  );
}

export function usePasswordVisibility() {
  const [visible, setVisible] = useState(false);
  return {
    type: visible ? ("text" as const) : ("password" as const),
    trailing: (
      <PasswordToggle visible={visible} onToggle={() => setVisible((v) => !v)} />
    ),
  };
}

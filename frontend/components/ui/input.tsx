import { cn } from "@/lib/utils/cn";

export interface InputProps extends React.ComponentProps<"input"> {
  invalid?: boolean;
}

/** Bare input. Use <Field> when you want a label and error message wired up. */
export function Input({ className, invalid, ...props }: InputProps) {
  return (
    <input
      aria-invalid={invalid || undefined}
      className={cn(
        "h-12 w-full rounded-lg bg-ink-200/70 px-4 text-sm text-ink-900",
        "placeholder:text-ink-500",
        "transition-[background-color,box-shadow] duration-200 ease-out-soft",
        "hover:bg-ink-200 focus:bg-white focus:ring-2 focus:ring-brand-500/60 focus:outline-none",
        "disabled:cursor-not-allowed disabled:opacity-60",
        invalid &&
          "bg-danger-50 ring-2 ring-danger-500/50 focus:ring-danger-500",
        className,
      )}
      {...props}
    />
  );
}

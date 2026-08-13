import { cn } from "@/lib/utils/cn";
import { Input, type InputProps } from "@/components/ui/input";

export interface FieldProps extends Omit<InputProps, "id"> {
  id: string;
  label: string;
  error?: string;
  /** Rendered inside the input's right edge, e.g. a password reveal toggle. */
  trailing?: React.ReactNode;
}

/**
 * Label + control + error message, wired for screen readers:
 * `aria-describedby` points at the error, and the message is `role="alert"` so
 * it is announced when validation fails.
 */
export function Field({
  id,
  label,
  error,
  trailing,
  className,
  ...props
}: FieldProps) {
  const errorId = `${id}-error`;

  return (
    <div className={cn("space-y-2", className)}>
      <label htmlFor={id} className="block text-sm font-semibold text-ink-800">
        {label}
      </label>

      <div className="relative">
        <Input
          id={id}
          invalid={Boolean(error)}
          aria-describedby={error ? errorId : undefined}
          className={trailing ? "pr-12" : undefined}
          {...props}
        />
        {trailing && (
          <div className="absolute inset-y-0 right-2 flex items-center">
            {trailing}
          </div>
        )}
      </div>

      {/* Reserve the row so the form doesn't jump when an error appears. */}
      <p
        id={errorId}
        role="alert"
        className={cn(
          "min-h-4 text-xs font-medium text-danger-600",
          "transition-opacity duration-200 ease-out-soft",
          error ? "opacity-100" : "opacity-0",
        )}
      >
        {error}
      </p>
    </div>
  );
}

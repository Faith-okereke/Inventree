import { AppIcon, icons } from "@/components/ui/app-icon";
import { cn } from "@/lib/utils/cn";

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps extends React.ComponentProps<"select"> {
  options: readonly SelectOption[];
  /** Inline label shown before the control, as in the Users page toolbar. */
  label?: string;
}

/** Native select — keyboard and mobile behaviour for free, with a custom chevron. */
export function Select({
  options,
  label,
  className,
  id,
  ...props
}: SelectProps) {
  const control = (
    <div className="relative">
      <select
        id={id}
        className={cn(
          "h-9 w-full appearance-none rounded-lg border border-ink-200 bg-white",
          "pr-9 pl-3 text-xs font-medium text-ink-700",
          "transition-[border-color,box-shadow] duration-200 ease-out-soft",
          "hover:border-ink-300 focus:border-brand-500 focus:outline-none",
          className,
        )}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <AppIcon
        name={icons.chevronDown}
        className="pointer-events-none absolute top-1/2 right-2.5 size-4 -translate-y-1/2 text-ink-500"
      />
    </div>
  );

  if (!label) return control;

  return (
    <div className="flex items-center gap-2">
      <label
        htmlFor={id}
        className="text-[11px] font-semibold tracking-wide text-ink-500 uppercase"
      >
        {label}
      </label>
      {control}
    </div>
  );
}

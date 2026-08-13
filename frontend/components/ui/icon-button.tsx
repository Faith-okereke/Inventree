import { AppIcon, type IconName } from "@/components/ui/app-icon";
import { cn } from "@/lib/utils/cn";

export interface IconButtonProps extends React.ComponentProps<"button"> {
  icon: IconName;
  /** Required — the icon is the only visible content, so it carries the name. */
  label: string;
  /** Small dot in the corner, e.g. unread notifications. */
  dot?: boolean;
}

/**
 * Square icon-only control. Server Component; an `onClick` passed from a Client
 * Component still works because the boundary belongs to the caller.
 */
export function IconButton({
  icon,
  label,
  dot,
  className,
  type = "button",
  ...props
}: IconButtonProps) {
  return (
    <button
      type={type}
      title={label}
      aria-label={label}
      className={cn(
        "relative grid size-9 shrink-0 place-items-center rounded-lg text-ink-500",
        "transition-[background-color,color,transform] duration-200 ease-out-soft",
        "hover:bg-ink-100 hover:text-ink-800 active:scale-95",
        className,
      )}
      {...props}
    >
      <AppIcon name={icon} className="size-5" />
      {dot && (
        <span
          aria-hidden
          className="absolute top-2 right-2 size-2 rounded-full bg-danger-500 ring-2 ring-white"
        />
      )}
    </button>
  );
}

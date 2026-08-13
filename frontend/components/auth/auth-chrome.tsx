import Link from "next/link";

import { AppIcon, icons } from "@/components/ui/app-icon";
import { Logo } from "@/components/brand/logo";

/** Divider + Google button, identical on both auth screens. */
export function AuthFooter({
  prompt,
  linkLabel,
  href,
}: {
  prompt: string;
  linkLabel: string;
  href: "/login" | "/signup";
}) {
  return (
    <div className="space-y-5">
      <p className="text-center text-sm text-ink-600">
        {prompt}{" "}
        <Link
          href={href}
          className="font-bold text-brand-600 underline-offset-4 transition-colors duration-150 hover:text-brand-700 hover:underline"
        >
          {linkLabel}
        </Link>
      </p>

      <div className="flex items-center gap-4" aria-hidden>
        <span className="h-px flex-1 bg-ink-200" />
        <span className="text-xs font-semibold text-ink-500">OR</span>
        <span className="h-px flex-1 bg-ink-200" />
      </div>

      <button
        type="button"
        className="mx-auto flex h-12 items-center justify-center gap-3 rounded-lg border border-ink-200 bg-white px-6 text-sm font-semibold text-ink-800 shadow-xs transition-[background-color,border-color,transform] duration-200 ease-out-soft hover:border-ink-300 hover:bg-ink-50 active:scale-[0.98]"
      >
        <AppIcon name={icons.google} className="size-5" />
        Continue with Google
      </button>
    </div>
  );
}

/** Wordmark + heading block above each form. */
export function AuthHeader({ title }: { title: string }) {
  return (
    <div className="space-y-6 text-center">
      <Logo className="inline-block" />
      <h1 className="text-2xl font-bold text-ink-900 sm:text-3xl">{title}</h1>
    </div>
  );
}

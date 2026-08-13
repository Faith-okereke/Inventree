"use client"
import Image from "next/image";

/**
 * Split-screen shell shared by login and signup.
 *
 * Server Component: the layout itself has no interactivity, so only the form
 * inside each page crosses the client boundary.
 *
 * Responsive: below `lg` the illustration panel is dropped entirely (rather than
 * stacked) so the form is the first thing on screen on a phone.
 */
export default function AuthLayout({ children }: LayoutProps<"/">) {
  return (
    <div className="grid min-h-dvh lg:flex ">
      <aside className="hidden lg:flex lg:items-center lg:justify-center lg:sticky lg:top-0 lg:h-screen lg:overflow-hidden lg:bg-canvas lg:p-12 lg:max-w-[35%]">
        {/* Soft radial wash behind the artwork */}
        <div
          aria-hidden
          className="absolute inset-0 bg-[radial-gradient(circle_at_30%_25%,rgba(255,255,255,0.28),transparent_60%)]"
        />
        <div className="animate-fade-up relative ">
         <Image src="/auth-image.png" alt="Auth Illustration" width={400} height={400} className="relative bottom-0 left-0"/>
        </div>
      </aside>

      <main className="flex-1 min-h-0 overflow-auto flex items-center justify-center bg-white px-5 py-10 sm:px-8 lg:min-w-[70%]">
        {children}
      </main>
    </div>
  );
}

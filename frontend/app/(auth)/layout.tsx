"use client";
import { Logo } from "@/components/brand/logo";
import Image from "next/image";

export default function AuthLayout({ children }: LayoutProps<"/">) {
  return (
    <div className="grid min-h-dvh lg:flex ">
      <aside
        className="relative hidden lg:flex lg:flex-col lg:items-center lg:justify-center lg:sticky lg:top-0 lg:h-screen lg:overflow-hidden lg:p-12 lg:max-w-[35%]"
        style={{ backgroundColor: "var(--color-brand-600)" }}
      >
        <div className="relative z-10 animate-fade-up flex flex-col items-center justify-normal text-center">
          <Logo className="text-3xl text-white" />
          <p className="text-white">
            Know what you have, where it is, and when to reorder
          </p>
        </div>

        <div className="relative z-10 animate-fade-up">
          <Image
            src="/auth-image.png"
            alt="Auth Illustration"
            width={620}
            height={620}
            className="relative bottom-0 left-0"
            priority
          />
        </div>
      </aside>
      <aside
        style={{ backgroundColor: "var(--color-brand-600)" }}
        className="relative block h-50 w-full overflow-hidden bg-brand-600 lg:hidden">
        <Logo className="absolute left-5 top-5 z-10 text-xl text-white" />
        <Image
          src="/auth-image.png"
          alt="Auth Illustration"
          width={250}
          height={250}
          className="absolute -bottom-36 right-3 left-auto"
          priority
        />
      </aside>

      <main className="flex-1 min-h-0 overflow-auto flex items-center justify-center bg-white px-5 py-10 sm:px-8 lg:min-w-[70%]">
        {children}
      </main>
    </div>
  );
}

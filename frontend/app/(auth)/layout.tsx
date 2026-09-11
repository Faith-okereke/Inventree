"use client";
import Image from "next/image";

export default function AuthLayout({ children }: LayoutProps<"/">) {
  return (
    <div className="grid min-h-dvh lg:flex ">
      <aside
        className="relative hidden lg:flex lg:flex-col lg:items-center lg:justify-center lg:sticky lg:top-0 lg:h-screen lg:overflow-hidden lg:p-12 lg:max-w-[35%]"
        style={{ backgroundColor: "var(--color-brand-600)" }}
      >
        <div className="relative z-10 animate-fade-up flex flex-col items-center justify-normal text-center">
          <h1 className="text-3xl text-white font-bold ">INVENTREE</h1>
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
        className="lg:hidden relative bg-brand-600 min-h-34 w-full block"
      >
        
          <Image
            src="/auth-image.png"
            alt="Auth Illustration"
            width={350}
            height={350}
            className="absolute -bottom-58 left-0"
            priority
          />
       
      </aside>

      <main className="flex-1 min-h-0 overflow-auto flex items-center justify-center bg-white px-5 py-10 sm:px-8 lg:min-w-[70%]">
        {children}
      </main>
    </div>
  );
}

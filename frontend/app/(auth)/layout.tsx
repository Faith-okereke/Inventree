"use client";
import Image from "next/image";

export default function AuthLayout({ children }: LayoutProps<"/">) {
  return (
    <div className="grid min-h-dvh lg:flex ">
      <aside className="hidden lg:flex lg:flex-col lg:items-center lg:justify-center lg:sticky lg:top-0 lg:h-screen lg:overflow-hidden lg:bg-canvas lg:p-12 lg:max-w-[35%]">
        <div className="animate-fade-up relative  mb-10 flex flex-col items-center justify-normal text-center">
          <h1 className="text-3xl text-white font-bold ">INVENTREE</h1>
          <p className="text-white"> Know what you have, where it is, and when to reorder</p>
        </div>

        {/* Soft radial wash behind the artwork */}
        <div
          aria-hidden
          className=" absolute inset-0 bg-[radial-gradient(circle_at_30%_25%,rgba(255,255,255,0.28),transparent_60%)]"
        />

        <div className="animate-fade-up relative bg-danger-400">
          <Image
            src="/auth-image.png"
            alt="Auth Illustration"
            width={500}
            height={500}
            className="relative bottom-0 left-0"
          />
        </div>
      </aside>

      <main className="flex-1 min-h-0 overflow-auto flex items-center justify-center bg-white px-5 py-10 sm:px-8 lg:min-w-[70%]">
        {children}
      </main>
    </div>
  );
}

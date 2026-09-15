"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { useAcceptInvitation } from "@/api-services/hooks/useInvitation";

export default function AcceptInvitationPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const { mutate, isPending } = useAcceptInvitation();
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    if (!name.trim() || !password.trim()) {
      setError("Name and password are required.");
      return;
    }
    mutate(
      { token, name, password },
      {
        onSuccess: () => {
          router.push("/dashboard");
        },
      },
    );
  };
  if (!token) {
    return (
      <div className="space-y-5">
        <div className="space-y-3 z-99">
          <h1 className="text-2xl lg:text-3xl uppercase font-bold lg:font-semibold tracking-tight text-black-500 ">
            Invalid Invitation
          </h1>
          <p className="max-w-sm text-sm leading-6 text-stone-600">
            The invitation link is invalid or missing. Please check the link or
            contact the inviter for assistance.
          </p>
        </div>
        <Link
          href="/"
          className="inline-flex h-12 w-full items-center justify-center rounded-xl bg-brand-600 px-6 text-sm font-semibold text-white shadow-[0_14px_30px_-16px_rgba(37,99,235,0.75)] transition-colors duration-200 hover:bg-brand-700 disabled:cursor-not-allowed disabled:bg-brand-300"
        >
          Go to Home
        </Link>
      </div>
    );
  }
  return (
    <div className="space-y-5">
      <div className="space-y-3 z-99">
        <h1 className="text-2xl lg:text-3xl uppercase font-bold lg:font-semibold tracking-tight text-black-500 ">
          Accept Invitation
        </h1>
        <p className="max-w-sm text-sm leading-6 text-stone-600">
          Please enter your full name and password to accept the invitation and
          create your account to be added to the business.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        method="post"
        noValidate
        className="space-y-5"
      >
        <div className="space-y-2">
          <label
            htmlFor="name"
            className="block text-sm font-medium text-stone-700"
          >
            Full Name
          </label>
          <input
            id="name"
            type="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoComplete="name"
            placeholder="Enter your full name"
            className="h-12 w-full rounded-xl border border-stone-200 bg-stone-50 px-4 text-sm text-stone-900 placeholder:text-stone-400 transition-colors duration-200 focus:border-brand-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-600"
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="password"
            className="block text-sm font-medium text-stone-700"
          >
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              placeholder="Enter your password"
              className="h-12 w-full rounded-xl border border-stone-200 bg-stone-50 px-4 pr-28 text-sm text-stone-900 placeholder:text-stone-400 transition-colors duration-200 focus:border-brand-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-600"
            />
            <button
              type="button"
              onClick={() => setShowPassword((value) => !value)}
              className="absolute inset-y-0 right-2 my-auto px-3 text-xs font-semibold text-stone-700 hover:text-stone-900"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
        </div>

        {error ? (
          <p className="text-sm font-medium text-red-600">{error}</p>
        ) : null}

        <button
          type="submit"
          disabled={isPending}
          className="inline-flex h-12 w-full items-center justify-center rounded-xl bg-brand-600 px-6 text-sm font-semibold text-white shadow-[0_14px_30px_-16px_rgba(37,99,235,0.75)] transition-colors duration-200 hover:bg-brand-700 disabled:cursor-not-allowed disabled:bg-brand-300"
        >
          {isPending ? "Adding you..." : "Accept Invite"}
        </button>
      </form>

      {/* <a
        href={`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/google`}
        className="inline-flex gap-2 h-12 w-full items-center justify-center rounded-xl border border-stone-200 px-6 text-sm font-semibold text-stone-700 transition-colors hover:bg-stone-50"
      >
        <AppIcon name={icons.google} label="Google" />
        Continue with Google
      </a> */}
    </div>
  );
}

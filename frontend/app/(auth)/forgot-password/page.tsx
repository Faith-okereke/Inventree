"use client";

import { useForgotPassword } from "@/api-services/hooks/useAuth";
import type { AxiosError } from "axios";
import Link from "next/link";
import { useState } from "react";
import toast from "react-hot-toast";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const { mutate, isPending, error } = useForgotPassword();

  const apiError = error
    ? (error as AxiosError<{ message?: string }>).response?.data?.message ||
      "An unexpected error occurred."
    : null;

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!email.trim()) {
      toast.error("Please enter your email address.");
      return;
    }

    mutate(email, {
      onSuccess: () => {
        setSubmitted(true);
      },
    });
  };

  if (submitted) {
    return (
      <div className="space-y-6">
        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-brand-600">
            Password reset
          </p>
          <h1 className="text-3xl font-semibold tracking-tight text-stone-900">
            Check your email
          </h1>
        </div>
        <p className="text-sm leading-6 text-stone-600">
          If an account with that email exists, we have sent a password reset
          link to it. Please click the link to reset your password.
        </p>
        <Link href="/login" className="font-semibold text-brand-700 hover:underline">
          Back to Log in
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-brand-600">
          Reset access
        </p>
        <h1 className="text-3xl font-semibold tracking-tight text-stone-900">
          Forgot your password?
        </h1>
        <p className="max-w-sm text-sm leading-6 text-stone-600">
          No worries. We&apos;ll send reset instructions to your email address.
        </p>
      </div>

      <form onSubmit={handleSubmit} noValidate className="space-y-5">
        <div className="space-y-2">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-stone-700"
          >
            Email Address
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            placeholder="Enter your email"
            className="h-12 w-full rounded-xl border border-stone-200 bg-stone-50 px-4 text-sm text-stone-900 placeholder:text-stone-400 transition-colors duration-200 focus:border-brand-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-600"
          />
        </div>

        {apiError ? <p className="text-sm font-medium text-red-600">{apiError}</p> : null}

        <button
          type="submit"
          disabled={isPending}
          className="inline-flex h-12 w-full items-center justify-center rounded-xl bg-brand-600 px-6 text-sm font-semibold text-white shadow-[0_14px_30px_-16px_rgba(37,99,235,0.75)] transition-colors duration-200 hover:bg-brand-700 disabled:cursor-not-allowed disabled:bg-brand-300"
        >
          {isPending ? "Sending..." : "Send Reset Link"}
        </button>
      </form>
    </div>
  );
}

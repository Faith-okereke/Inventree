
"use client";

import { useForgotPassword } from "@/api/hooks/useAuth";
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
      <div className="w-full max-w-md space-y-8 text-center">
        <h1 className="text-3xl font-bold text-ink-900">Check your email</h1>
        <p className="text-sm text-ink-600">
          If an account with that email exists, we have sent a password reset
          link to it. Please click the link to reset your password.
        </p>
        <Link
          href="/login"
          className="font-bold text-brand-600 hover:underline"
        >
          Back to Log in
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md space-y-8">
      <div className="space-y-3 text-center">
        <h1 className="text-3xl font-bold text-ink-900">Forgot Password?</h1>
        <p className="text-sm text-ink-600">
          No worries, we&apos;ll send you reset instructions.
        </p>
      </div>

      <form onSubmit={handleSubmit} noValidate className="space-y-4 bg-white p-6">
        <div className="space-y-2">
          <label
            htmlFor="email"
            className="block text-sm font-semibold text-ink-800"
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
            className="h-12 w-full rounded-lg bg-ink-200/70 px-4 text-sm text-ink-900 placeholder:text-ink-500 transition-[background-color,box-shadow] duration-200 ease-out-soft hover:bg-ink-200 focus:bg-white focus:ring-2 focus:ring-brand-500/60 focus:outline-none"
          />
        </div>

        {apiError && <p className="text-sm font-medium text-danger-600">{apiError}</p>}

        <button type="submit" disabled={isPending} className="inline-flex h-12 w-full items-center justify-center rounded-lg bg-brand-600 px-6 text-sm font-semibold text-white shadow-sm transition-colors duration-200 hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60">
          {isPending ? "Sending..." : "Send Reset Link"}
        </button>
      </form>
    </div>
  );
}

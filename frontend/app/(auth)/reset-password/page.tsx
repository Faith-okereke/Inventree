"use client";

import { useResetPassword, useVerifyResetPassword } from "@/api-services/hooks/useAuth";
import type { AxiosError } from "axios";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import type { Route } from "next";
import { AppIcon, icons } from "@/components/ui/app-icon";
import { Suspense, useEffect, useState } from "react";
import toast from "react-hot-toast";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const {
    mutate: verifyToken,
    isPending: isVerifying,
    isSuccess: isTokenValid,
    isError: isVerificationError,
    error: verificationError,
  } = useVerifyResetPassword();

  const {
    mutate: resetPassword,
    isPending: isResetting,
    error: resetError,
  } = useResetPassword();

  useEffect(() => {
    if (token) {
      verifyToken(token);
    }
  }, [token, verifyToken]);

  const handleResetSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!newPassword || !confirmPassword) {
      toast.error("Please fill in both password fields.");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }
    if (newPassword.length < 8) {
      toast.error("Password must be at least 8 characters long.");
      return;
    }
    if (token) {
      resetPassword(
        { token, newPassword },
        {
          onSuccess: () => {
            router.push("/login");
          },
        },
      );
    }
  };

  const apiVerificationError = verificationError
    ? (verificationError as AxiosError<{ message?: string }>).response?.data
        ?.message || "An unexpected error occurred during verification."
    : null;

  const apiResetError = resetError
    ? (resetError as AxiosError<{ message?: string }>).response?.data
        ?.message || "An unexpected error occurred while resetting."
    : null;

  if (isVerifying) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 text-center">
        <AppIcon name={icons.loader} className="size-8 animate-spin text-stone-500" />
        <p className="text-stone-600">Verifying token...</p>
      </div>
    );
  }

  if (!token || isVerificationError) {
    return (
      <div className="space-y-6">
        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-brand-600">
            Reset access
          </p>
          <h1 className="text-3xl font-semibold tracking-tight text-stone-900">
            Invalid or expired link
          </h1>
        </div>
        <p className="text-sm leading-6 text-stone-600">
          {apiVerificationError ||
            "The password reset link is either invalid or has expired. Please request a new one."}
        </p>
        <Link href={"/forgot-password" as Route} className="font-semibold text-brand-700 hover:underline">
          Request a new link
        </Link>
      </div>
    );
  }

  if (isTokenValid) {
    return (
      <div className="space-y-8">
        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-brand-600">
            Reset access
          </p>
          <h1 className="text-3xl font-semibold tracking-tight text-stone-900">
            Set a new password
          </h1>
          <p className="max-w-sm text-sm leading-6 text-stone-600">
            Choose a new password to finish resetting your account.
          </p>
        </div>

        <form onSubmit={handleResetSubmit} noValidate className="space-y-5">
          <div className="space-y-2">
            <label
              htmlFor="new-password"
              className="block text-sm font-medium text-stone-700"
            >
              New Password
            </label>
            <div className="relative">
              <input
                id="new-password"
                type={showPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                autoComplete="new-password"
                placeholder="Enter your new password"
                className="h-12 w-full rounded-xl border border-stone-200 bg-stone-50 px-4 pr-28 text-sm text-stone-900 placeholder:text-stone-400 transition-colors duration-200 focus:border-brand-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-600"
              />
              <button
                type="button"
                onClick={() => setShowPassword((value) => !value)}
                className="absolute inset-y-0 right-2 my-auto rounded-md border border-stone-200 bg-white px-3 text-xs font-semibold text-stone-700 hover:border-stone-300 hover:text-stone-900"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <label
              htmlFor="confirm-password"
              className="block text-sm font-medium text-stone-700"
            >
              Confirm New Password
            </label>
            <div className="relative">
              <input
                id="confirm-password"
                type={showPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                autoComplete="new-password"
                placeholder="Confirm your new password"
                className="h-12 w-full rounded-xl border border-stone-200 bg-stone-50 px-4 pr-28 text-sm text-stone-900 placeholder:text-stone-400 transition-colors duration-200 focus:border-brand-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-600"
              />
              <button
                type="button"
                onClick={() => setShowPassword((value) => !value)}
                className="absolute inset-y-0 right-2 my-auto rounded-md border border-stone-200 bg-white px-3 text-xs font-semibold text-stone-700 hover:border-stone-300 hover:text-stone-900"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          {apiResetError ? <p className="text-sm font-medium text-red-600">{apiResetError}</p> : null}

          <button
            type="submit"
            disabled={isResetting}
            className="inline-flex h-12 w-full items-center justify-center rounded-xl bg-brand-600 px-6 text-sm font-semibold text-white shadow-[0_14px_30px_-16px_rgba(37,99,235,0.75)] transition-colors duration-200 hover:bg-brand-700 disabled:cursor-not-allowed disabled:bg-brand-300"
          >
            {isResetting ? "Resetting..." : "Reset Password"}
          </button>
        </form>
      </div>
    );
  }

  return null;
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<p className="text-center text-stone-600">Loading...</p>}>
      <ResetPasswordForm />
    </Suspense>
  );
}

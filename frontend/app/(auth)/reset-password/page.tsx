"use client";

import { useResetPassword, useVerifyResetPassword } from "@/api/hooks/useAuth";
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
        <AppIcon name={icons.loader} className="size-8 animate-spin text-ink-500" />
        <p className="text-ink-600">Verifying token...</p>
      </div>
    );
  }

  if (!token || isVerificationError) {
    return (
      <div className="w-full max-w-md space-y-6 text-center">
        <h1 className="text-2xl font-bold text-danger-600">
          Invalid or Expired Link
        </h1>
        <p className="text-sm text-ink-600">
          {apiVerificationError ||
            "The password reset link is either invalid or has expired. Please request a new one."}
        </p>
        <Link
          href={"/forgot-password" as Route}
          className="font-bold text-brand-600 hover:underline"
        >
          Request a new link
        </Link>
      </div>
    );
  }

  if (isTokenValid) {
    return (
      <div className="w-full max-w-md space-y-8">
        <div className="space-y-3 text-center">
          <h1 className="text-3xl font-bold text-ink-900">Reset Your Password</h1>
          <p className="text-sm text-ink-600">
            Please enter your new password below.
          </p>
        </div>

        <form onSubmit={handleResetSubmit} noValidate className="space-y-4 bg-white p-6">
          <div className="space-y-2">
            <label
              htmlFor="new-password"
              className="block text-sm font-semibold text-ink-800"
            >
              New Password
            </label>
           <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              autoComplete="current-password"
              placeholder="Enter your password"
              className="h-12 w-full rounded-lg bg-ink-200/70 px-4 pr-28 text-sm text-ink-900 placeholder:text-ink-500 transition-[background-color,box-shadow] duration-200 ease-out-soft hover:bg-ink-200 focus:bg-white focus:ring-2 focus:ring-brand-500/60 focus:outline-none"
            />
            <button
              type="button"
              onClick={() => setShowPassword((value) => !value)}
              className="absolute inset-y-0 right-2 my-auto rounded-md px-3 text-xs font-semibold text-ink-600 hover:bg-ink-100 hover:text-ink-900"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
          </div>
          <div className="space-y-2">
            <label
              htmlFor="confirm-password"
              className="block text-sm font-semibold text-ink-800"
            >
              Confirm New Password
            </label>
            <div className="relative">
            <input
              id="confirm-password"
              type={showPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              autoComplete="current-password"
              placeholder="Confirm new password"
              className="h-12 w-full rounded-lg bg-ink-200/70 px-4 pr-28 text-sm text-ink-900 placeholder:text-ink-500 transition-[background-color,box-shadow] duration-200 ease-out-soft hover:bg-ink-200 focus:bg-white focus:ring-2 focus:ring-brand-500/60 focus:outline-none"
            />
            <button
              type="button"
              onClick={() => setShowPassword((value) => !value)}
              className="absolute inset-y-0 right-2 my-auto rounded-md px-3 text-xs font-semibold text-ink-600 hover:bg-ink-100 hover:text-ink-900"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
          </div>
          {apiResetError && <p className="text-sm font-medium text-danger-600">{apiResetError}</p>}
          <button type="submit" disabled={isResetting} className="inline-flex h-12 w-full items-center justify-center rounded-lg bg-brand-600 px-6 text-sm font-semibold text-white shadow-sm transition-colors duration-200 hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60">
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
    <Suspense fallback={<p className="text-center text-ink-600">Loading...</p>}>
      <ResetPasswordForm />
    </Suspense>
  );
}
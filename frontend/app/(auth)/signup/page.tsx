"use client";

import { useRegister } from "@/api/hooks/useAuth";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SignupPage() {
  const { mutate, isPending } = useRegister();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const role = "staff";

  const router = useRouter();

  const  handleSubmit = async(event: React.FormEvent<HTMLFormElement>)=> {
    event.preventDefault();
    setError("");

    if (!fullName.trim() || !email.trim() || !password.trim()) {
      setError("Full name, email, and password are required.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    mutate(
      { name: fullName, email, password, role },
      {
        onSuccess: () => {
          router.push("/login");
        },
      },
    );
  }

  return (
    <div className="w-full max-w-md space-y-8">
      <div className="space-y-3 text-center">
        <h1 className="text-3xl font-bold text-ink-900">Create your Account</h1>
        <p className="text-sm text-ink-600">
          Create an Inventree account to manage industrial inventory.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        noValidate
        className="space-y-4 bg-white p-6 "
      >
        <div className="space-y-2">
          <label
            htmlFor="fullName"
            className="block text-sm font-semibold text-ink-800"
          >
            Full Name
          </label>
          <input
            id="fullName"
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            autoComplete="name"
            placeholder="Enter your full name"
            className="h-12 w-full rounded-lg bg-ink-200/70 px-4 text-sm text-ink-900 placeholder:text-ink-500 transition-[background-color,box-shadow] duration-200 ease-out-soft hover:bg-ink-200 focus:bg-white focus:ring-2 focus:ring-brand-500/60 focus:outline-none"
          />
        </div>

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

        <div className="space-y-2">
          <label
            htmlFor="password"
            className="block text-sm font-semibold text-ink-800"
          >
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
              placeholder="Create a password"
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

        {error ? (
          <p className="text-sm font-medium text-danger-600">{error}</p>
        ) : null}

        <button
          type="submit"
          disabled={isPending}
          className="inline-flex h-12 w-full items-center justify-center rounded-lg bg-brand-600 px-6 text-sm font-semibold text-white shadow-sm transition-colors duration-200 hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isPending ? "Creating account..." : "Create Account"}
        </button>
      </form>

      <p className="text-center text-sm text-ink-600">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-bold text-brand-600 hover:underline"
        >
          Log in
        </Link>
      </p>
    </div>
  );
}

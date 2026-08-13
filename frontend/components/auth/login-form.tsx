"use client";

import { useRouter } from "next/navigation";

import { usePasswordVisibility } from "@/components/auth/password-toggle";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { useZodForm } from "@/lib/hooks/use-zod-form";
import { loginSchema } from "@/lib/validation/auth.schema";

export function LoginForm() {
  const router = useRouter();
  const password = usePasswordVisibility();

  const { field, handleSubmit, isPending } = useZodForm({
    schema: loginSchema,
    initialValues: { email: "", password: "" },
    // UI only — no API call. On valid input we just move to the dashboard.
    onValid: () => router.push("/dashboard"),
  });

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-1">
      <Field
        {...field("email")}
        label="Email Address"
        type="email"
        inputMode="email"
        placeholder="Enter your email"
        autoComplete="email"
      />

      <Field
        {...field("password")}
        label="Password"
        type={password.type}
        trailing={password.trailing}
        placeholder="Enter your password"
        autoComplete="current-password"
      />

      <Button
        type="submit"
        size="lg"
        disabled={isPending}
        className="mx-auto mt-3 flex w-full max-w-56"
      >
        {/* The Figma login frame labels this CTA "Create Account" — the signup
            frame's label, left in by mistake. Corrected here; revert if intended. */}
        {isPending ? "Signing in…" : "Log in"}
      </Button>
    </form>
  );
}

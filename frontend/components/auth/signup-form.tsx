"use client";

import { useRouter } from "next/navigation";

import { usePasswordVisibility } from "@/components/auth/password-toggle";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { useZodForm } from "@/lib/hooks/use-zod-form";
import { signupSchema } from "@/lib/validation/auth.schema";

export function SignupForm() {
  const router = useRouter();
  const password = usePasswordVisibility();

  const { field, handleSubmit, isPending } = useZodForm({
    schema: signupSchema,
    initialValues: { fullName: "", email: "", password: "" },
    // UI only — no API call. On valid input we just move to the dashboard.
    onValid: () => router.push("/dashboard"),
  });

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-1">
      <Field
        {...field("fullName")}
        label="Full Name"
        placeholder="Enter your full name"
        autoComplete="name"
        autoCapitalize="words"
      />

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
        autoComplete="new-password"
      />

      <Button
        type="submit"
        size="lg"
        disabled={isPending}
        className="mx-auto mt-3 flex w-full max-w-56"
      >
        {isPending ? "Creating account…" : "Create Account"}
      </Button>
    </form>
  );
}

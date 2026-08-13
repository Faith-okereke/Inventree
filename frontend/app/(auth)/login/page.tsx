import type { Metadata } from "next";

import { AuthFooter, AuthHeader } from "@/components/auth/auth-chrome";
import { LoginForm } from "@/components/auth/login-form";

export const metadata: Metadata = {
  title: "Login to your Account",
  description: "Sign in to your Inventree account.",
};

/**
 * Server Component. Static — nothing here reads request data, so the whole
 * shell is prerendered at build time and only <LoginForm /> hydrates.
 */
export default function LoginPage() {
  return (
    <div className="animate-fade-up w-full max-w-md space-y-8">
      <AuthHeader title="Login to your Account" />
      <LoginForm />
      <AuthFooter
        prompt="Don't have an account?"
        linkLabel="Sign up"
        href="/signup"
      />
    </div>
  );
}

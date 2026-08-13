import type { Metadata } from "next";

import { AuthFooter, AuthHeader } from "@/components/auth/auth-chrome";
import { SignupForm } from "@/components/auth/signup-form";

export const metadata: Metadata = {
  title: "Create your Account",
  description: "Create an Inventree account to manage industrial inventory.",
};

/**
 * Server Component. Static — nothing here reads request data, so the whole
 * shell is prerendered at build time and only <SignupForm /> hydrates.
 */
export default function SignupPage() {
  return (
    <div className="animate-fade-up w-full max-w-md space-y-8">
      <AuthHeader title="Create your Account" />
      <SignupForm />
      <AuthFooter
        prompt="Already have an account?"
        linkLabel="Log in"
        href="/login"
      />
    </div>
  );
}

import { z } from "zod";

const email = z
  .string()
  .trim()
  .min(1, "Email address is required")
  // Zod 4 moved format checks to top-level schemas; `.email()` on a string is
  // the deprecated v3 spelling.
  .pipe(z.email("Enter a valid email address"));

const password = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .regex(/[a-z]/, "Include at least one lowercase letter")
  .regex(/[A-Z]/, "Include at least one uppercase letter")
  .regex(/[0-9]/, "Include at least one number");

export const loginSchema = z.object({
  email,
  // Login only checks presence — strength rules belong on signup, and echoing
  // them here would hint at another account's password format.
  password: z.string().min(1, "Password is required"),
});

export const signupSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, "Full name is required")
    .max(80, "Full name is too long")
    .regex(/^[\p{L}\p{M}'\-.\s]+$/u, "Use letters, spaces, hyphens or apostrophes"),
  email,
  password,
});

export type LoginValues = z.infer<typeof loginSchema>;
export type SignupValues = z.infer<typeof signupSchema>;

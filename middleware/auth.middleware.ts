import { z } from 'zod';

const emailSchema = z.string({ message: 'Email is required!' }).trim().min(1, 'Email is required!').email('Email must be a valid email address');

export const passwordSchema = z
    .string({ message: 'Password must be a string' })
    .min(8, 'Password must be at least 8 characters long')
    .regex(/[a-z]/, 'Password must include at least one lowercase letter')
    .regex(/[A-Z]/, 'Password must include at least one uppercase letter')
    .regex(/\d/, 'Password must include at least one number')
    .regex(/[^A-Za-z0-9]/, 'Password must include at least one special character');

export const registerRequestSchema = z.object({
    email: emailSchema,
    password: passwordSchema,
    name: z.string({ message: 'Name is required!' }).trim().min(1, 'Name is required!'),
    role: z.string().optional(),
});

export const loginRequestSchema = z.object({
    email: emailSchema,
    password: z.string({ message: 'Password is required!' }).min(1, 'Password is required!'),
});

import { z } from 'zod';

export const userIdSchema = z.object({
    id: z.string().uuid('User ID must be a valid UUID.'),
});

export const createUserSchema = z.object({
    name: z.string().trim().min(1, 'Name is required.'),
    email: z.string().trim().email('A valid email is required.'),
    password: z.string().min(8, 'Password must be at least 8 characters.'),
    role: z.enum(['admin', 'staff']).optional(),
});

export const updateUserSchema = z
    .object({
        name: z.string().trim().min(1, 'Name is required.').optional(),
        email: z.string().trim().email('A valid email is required.').optional(),
        role: z.enum(['admin', 'staff']).optional(),
    })
    .refine((data) => Object.keys(data).length > 0, {
        message: 'At least one field must be provided.',
    });

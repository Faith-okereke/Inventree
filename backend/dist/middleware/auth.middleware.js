"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginRequestSchema = exports.registerRequestSchema = exports.passwordSchema = void 0;
const zod_1 = require("zod");
const emailSchema = zod_1.z.string({ message: 'Email is required!' }).trim().min(1, 'Email is required!').email('Email must be a valid email address');
exports.passwordSchema = zod_1.z
    .string({ message: 'Password must be a string' })
    .min(8, 'Password must be at least 8 characters long')
    .regex(/[a-z]/, 'Password must include at least one lowercase letter')
    .regex(/[A-Z]/, 'Password must include at least one uppercase letter')
    .regex(/\d/, 'Password must include at least one number')
    .regex(/[^A-Za-z0-9]/, 'Password must include at least one special character');
exports.registerRequestSchema = zod_1.z.object({
    email: emailSchema,
    password: exports.passwordSchema,
    name: zod_1.z.string({ message: 'Name is required!' }).trim().min(1, 'Name is required!'),
    role: zod_1.z.string().optional(),
});
exports.loginRequestSchema = zod_1.z.object({
    email: emailSchema,
    password: zod_1.z.string({ message: 'Password is required!' }).min(1, 'Password is required!'),
});

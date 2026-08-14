"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserSchema = exports.createUserSchema = exports.userIdSchema = void 0;
const zod_1 = require("zod");
exports.userIdSchema = zod_1.z.object({
    id: zod_1.z.string().uuid('User ID must be a valid UUID.'),
});
exports.createUserSchema = zod_1.z.object({
    name: zod_1.z.string().trim().min(1, 'Name is required.'),
    email: zod_1.z.string().trim().email('A valid email is required.'),
    password: zod_1.z.string().min(8, 'Password must be at least 8 characters.'),
    role: zod_1.z.enum(['admin', 'staff']).optional(),
});
exports.updateUserSchema = zod_1.z
    .object({
    name: zod_1.z.string().trim().min(1, 'Name is required.').optional(),
    email: zod_1.z.string().trim().email('A valid email is required.').optional(),
    role: zod_1.z.enum(['admin', 'staff']).optional(),
})
    .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field must be provided.',
});

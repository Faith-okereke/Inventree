"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderIdSchema = exports.updateOrderStatusSchema = exports.createOrderSchema = void 0;
const zod_1 = require("zod");
exports.createOrderSchema = zod_1.z.object({
    items: zod_1.z.array(zod_1.z.object({
        productId: zod_1.z.string().uuid('Each item must have a valid product UUID.'),
        quantity: zod_1.z.coerce.number().int().gt(0, 'Each item must have a quantity greater than 0.'),
    })).min(1, 'Order must contain at least one item.'),
});
exports.updateOrderStatusSchema = zod_1.z.object({
    status: zod_1.z.enum(['pending', 'fulfilled', 'cancelled'], {
        message: 'Status must be one of: pending, fulfilled, or cancelled.',
    }),
});
exports.orderIdSchema = zod_1.z.object({
    id: zod_1.z.string().uuid('Order ID must be a valid UUID.'),
});

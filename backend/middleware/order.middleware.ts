import { z } from 'zod';

export const createOrderSchema = z.object({
    items: z.array(
        z.object({
            productId: z.string().uuid('Each item must have a valid product UUID.'),
            quantity: z.coerce.number().int().gt(0, 'Each item must have a quantity greater than 0.'),
        }),
    ).min(1, 'Order must contain at least one item.'),
});

export const updateOrderStatusSchema = z.object({
    status: z.enum(['pending', 'fulfilled', 'cancelled'], {
        message: 'Status must be one of: pending, fulfilled, or cancelled.',
    }),
});

export const orderIdSchema = z.object({
    id: z.string().uuid('Order ID must be a valid UUID.'),
});

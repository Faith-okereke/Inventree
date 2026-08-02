import { z } from 'zod';

export const productRequestSchema = z.object({
    name: z.string().trim().min(1, 'Product name is required.'),
    description: z.string().min(1, 'Description is required.'),
    price: z.coerce.number().positive('Price must be a positive number.'),
    sku: z.string().trim().min(1, 'SKU is required.'),
    image: z.string().min(1, 'Image is required.').url('Image must be a valid URL.'),
    quantityInStock: z.preprocess(
        (value) => (value === '' || value === null ? undefined : value),
        z.coerce.number().int().min(0, 'Quantity in stock must be a non-negative integer.').optional(),
    ),
});

export const productIdSchema = z.object({
    id: z.string().uuid('Product ID must be a valid UUID.'),
});

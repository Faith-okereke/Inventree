"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.productIdSchema = exports.productRequestSchema = void 0;
const zod_1 = require("zod");
exports.productRequestSchema = zod_1.z.object({
    name: zod_1.z.string().trim().min(1, 'Product name is required.'),
    description: zod_1.z.string().min(1, 'Description is required.'),
    price: zod_1.z.coerce.number().positive('Price must be a positive number.'),
    sku: zod_1.z.string().trim().min(1, 'SKU is required.'),
    image: zod_1.z.string().min(1, 'Image is required.').url('Image must be a valid URL.'),
    quantityInStock: zod_1.z.preprocess((value) => (value === '' || value === null ? undefined : value), zod_1.z.coerce.number().int().min(0, 'Quantity in stock must be a non-negative integer.').optional()),
});
exports.productIdSchema = zod_1.z.object({
    id: zod_1.z.string().uuid('Product ID must be a valid UUID.'),
});

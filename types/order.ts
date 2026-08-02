type OrderItemInput = {
    productId: string;
    quantity: number;
};

export type CreateOrderInput = {
    userId: string;
    status?: string; // 'pending', 'fulfilled', 'cancelled'
    items: OrderItemInput[];
};

export type UpdateOrderInput = {
    status?: string;
};
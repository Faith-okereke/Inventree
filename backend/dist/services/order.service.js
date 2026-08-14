"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateOrderStatus = exports.deleteOrder = exports.updateOrder = exports.createOrder = exports.getOrderById = exports.getOrders = void 0;
const prisma_1 = require("../database/prisma");
const orderInclude = {
    user: {
        select: {
            id: true,
            name: true,
            email: true,
        },
    },
    orderItems: {
        include: {
            product: {
                select: {
                    id: true,
                    name: true,
                    price: true,
                    sku: true,
                },
            },
        },
    },
};
const getOrders = async (status) => {
    return await prisma_1.prisma.order.findMany({
        where: status ? { status } : undefined,
        orderBy: { createdAt: 'desc' },
        include: orderInclude,
    });
};
exports.getOrders = getOrders;
const getOrderById = async (id) => {
    return await prisma_1.prisma.order.findUnique({
        where: { id },
        include: orderInclude,
    });
};
exports.getOrderById = getOrderById;
const createOrder = async (data) => {
    const { userId, status, items } = data;
    return await prisma_1.prisma.$transaction(async (tx) => {
        const productIds = items.map(item => item.productId);
        const products = await tx.product.findMany({
            where: {
                id: { in: productIds },
            },
        });
        if (products.length !== productIds.length) {
            throw new Error("One or more products not found.");
        }
        const productMap = new Map(products.map((p) => [p.id, p]));
        for (const item of items) {
            const product = productMap.get(item.productId);
            if (!product) {
                throw new Error(`Product with ID ${item.productId} not found.`);
            }
            if (product.quantityInStock < item.quantity) {
                throw new Error(`Insufficient stock for product ${product.name}. Available: ${product.quantityInStock}, Requested: ${item.quantity}`);
            }
        }
        const newOrder = await tx.order.create({
            data: {
                userId,
                status: status || 'pending',
                createdAt: new Date(),
            },
        });
        const orderItemsData = items.map(item => {
            const product = productMap.get(item.productId);
            return {
                orderId: newOrder.id,
                productId: item.productId,
                quantity: item.quantity,
                priceAtOrder: product.price,
            };
        });
        await tx.orderItem.createMany({ data: orderItemsData });
        for (const item of items) {
            await tx.product.update({
                where: { id: item.productId },
                data: { quantityInStock: { decrement: item.quantity } },
            });
        }
        return tx.order.findUnique({
            where: { id: newOrder.id },
            include: orderInclude,
        });
    });
};
exports.createOrder = createOrder;
const updateOrder = async (id, data) => {
    return await prisma_1.prisma.order.update({
        where: { id },
        data: {
            status: data.status,
        },
    });
};
exports.updateOrder = updateOrder;
const deleteOrder = async (id) => {
    return await prisma_1.prisma.$transaction(async (tx) => {
        await tx.orderItem.deleteMany({
            where: { orderId: id },
        });
        return await tx.order.delete({ where: { id } });
    });
};
exports.deleteOrder = deleteOrder;
const updateOrderStatus = async (id, status) => {
    return prisma_1.prisma.order.update({
        where: { id },
        data: { status },
        include: orderInclude,
    });
};
exports.updateOrderStatus = updateOrderStatus;

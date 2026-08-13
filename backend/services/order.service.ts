import { prisma } from "../database/prisma"
import { CreateOrderInput, UpdateOrderInput } from "../types/order"

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
} as const

export const getOrders = async (status?: string) => {
    return await prisma.order.findMany({
        where: status ? { status } : undefined,
        orderBy: { createdAt: 'desc' },
        include: orderInclude,
    })
}

export const getOrderById = async (id: string) => {
    return await prisma.order.findUnique({
        where: { id },
        include: orderInclude,
    })
}

export const createOrder = async (data: CreateOrderInput) => {
    const { userId, status, items } = data

    return await prisma.$transaction(async (tx) => {
        const productIds = items.map(item => item.productId)
        const products = await tx.product.findMany({
            where: {
                id: { in: productIds },
            },
        })

        if (products.length !== productIds.length) {
            throw new Error("One or more products not found.")
        }

        const productMap = new Map(products.map(p => [p.id, p]))

        for (const item of items) {
            const product = productMap.get(item.productId)
            if (!product) {
                throw new Error(`Product with ID ${item.productId} not found.`)
            }
            if (product.quantityInStock < item.quantity) {
                throw new Error(`Insufficient stock for product ${product.name}. Available: ${product.quantityInStock}, Requested: ${item.quantity}`)
            }
        }

        const newOrder = await tx.order.create({
            data: {
                userId,
                status: status || 'pending',
                createdAt: new Date(),
            },
        })

        const orderItemsData = items.map(item => {
            const product = productMap.get(item.productId)!
            return {
                orderId: newOrder.id,
                productId: item.productId,
                quantity: item.quantity,
                priceAtOrder: product.price,
            }
        })

        await tx.orderItem.createMany({ data: orderItemsData })

        for (const item of items) {
            await tx.product.update({
                where: { id: item.productId },
                data: { quantityInStock: { decrement: item.quantity } },
            })
        }

        return tx.order.findUnique({
            where: { id: newOrder.id },
            include: orderInclude,
        })
    })
}

export const updateOrder = async (id: string, data: UpdateOrderInput) => {
    return await prisma.order.update({
        where: { id },
        data: {
            status: data.status,
        },
    })
}

export const deleteOrder = async (id: string) => {
    return await prisma.$transaction(async (tx) => {
        await tx.orderItem.deleteMany({
            where: { orderId: id },
        })
        return await tx.order.delete({ where: { id } })
    })
}

export const updateOrderStatus = async (id: string, status: string) => {
    return prisma.order.update({
        where: { id },
        data: { status },
        include: orderInclude,
    })
}


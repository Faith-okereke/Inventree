import { prisma } from "../database/prisma"
import { Prisma } from "../generated/prisma/client"
import { sendLowStockAlertEmail } from "../emails/low-stock-alert"
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

type InventoryProduct = {
    id: string
    name: string
    price: Prisma.Decimal
    quantityInStock: number
}

export const getOrders = async (status?: string, page: number = 1, pageSize: number = 10) => {
    const skip = (page - 1) * pageSize;

    const [data, total] = await Promise.all([
        prisma.order.findMany({
            where: status ? { status } : undefined,
            skip,
            take: pageSize,
            orderBy: { createdAt: "desc" },
            include: orderInclude,
        }),
        prisma.order.count({
            where: status ? { status } : undefined,
        }),
    ]);
    return {
        data,
        pagination: {
            page,
            pageSize,
            total,
            totalPages: Math.ceil(total / pageSize),
        },
    };
}

export const getOrderById = async (id: string) => {
    return await prisma.order.findUnique({
        where: { id },
        include: orderInclude,
    })
}

export const createOrder = async (data: CreateOrderInput) => {
    const { userId, status, items } = data

    return await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
        const productIds = items.map(item => item.productId)
        const products = await tx.product.findMany({
            where: {
                id: { in: productIds },
            },
        }) as InventoryProduct[]

        if (products.length !== productIds.length) {
            throw new Error("One or more products not found.")
        }

        const productMap = new Map<string, InventoryProduct>(products.map((p: InventoryProduct) => [p.id, p]))

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
            const productBeforeUpdate = await tx.product.findUnique({ where: { id: item.productId } })
            const updatedProduct = await tx.product.update({
                where: { id: item.productId },
                data: { quantityInStock: { decrement: item.quantity } },
            })

            if (
                productBeforeUpdate &&
                productBeforeUpdate.supplierEmail &&
                productBeforeUpdate.quantityInStock > (productBeforeUpdate.lowStockThreshold ?? 0) &&
                updatedProduct.quantityInStock <= (productBeforeUpdate.lowStockThreshold ?? 0) &&
                !productBeforeUpdate.lowStockAlertSentAt
            ) {
                await sendLowStockAlertEmail({
                    name: updatedProduct.name,
                    sku: updatedProduct.sku,
                    quantityInStock: updatedProduct.quantityInStock,
                    lowStockThreshold: updatedProduct.lowStockThreshold,
                    supplierEmail: updatedProduct.supplierEmail,
                })

                await tx.product.update({
                    where: { id: item.productId },
                    data: {
                        lowStockAlertSentAt: new Date(),
                    },
                })
            }

            if (updatedProduct.quantityInStock > (productBeforeUpdate?.lowStockThreshold ?? 0)) {
                await tx.product.update({
                    where: { id: item.productId },
                    data: { lowStockAlertSentAt: null },
                })
            }
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
    return await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
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
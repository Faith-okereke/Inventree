import { prisma } from "../database/prisma"
import { Prisma } from "../generated/prisma/client"

const dashboardLowStockThreshold = 5

type DashboardOrder = {
    status: string
}

type DashboardOrderItem = {
    quantity: number
    priceAtOrder: Prisma.Decimal
    productId: string
    product: {
        id: string
        name: string
        sku: string
    }
}

type LowStockProduct = {
    id: string
    name: string
    sku: string
    quantityInStock: number
}

export const getOrderDashboard = async () => {
    const [orders, orderItems, lowStockProducts] = await prisma.$transaction([
        prisma.order.findMany({
            select: {
                status: true,
            },
        }),
        prisma.orderItem.findMany({
            select: {
                quantity: true,
                priceAtOrder: true,
                productId: true,
                product: {
                    select: {
                        id: true,
                        name: true,
                        sku: true,
                    },
                },
            },
        }),
        prisma.product.findMany({
            where: {
                quantityInStock: {
                    lte: dashboardLowStockThreshold,
                },
            },
            select: {
                id: true,
                name: true,
                sku: true,
                quantityInStock: true,
            },
            orderBy: {
                quantityInStock: 'asc',
            },
        }),
    ]) as [DashboardOrder[], DashboardOrderItem[], LowStockProduct[]]

    const ordersByStatus = orders.reduce<Record<string, number>>((acc, order) => {
        acc[order.status] = (acc[order.status] ?? 0) + 1
        return acc
    }, {})

    const revenue = orderItems.reduce((total: number, item: DashboardOrderItem) => {
        const price = Number(item.priceAtOrder)
        return total + (price * item.quantity)
    }, 0)

    const productStats = orderItems.reduce<Map<string, { productId: string; name: string; sku: string; totalQuantity: number }>>((acc, item) => {
        const existing = acc.get(item.productId)
        const quantity = item.quantity
        if (existing) {
            existing.totalQuantity += quantity
            return acc
        }
        acc.set(item.productId, {
            productId: item.productId,
            name: item.product.name,
            sku: item.product.sku,
            totalQuantity: quantity,
        })
        return acc
    }, new Map<string, { productId: string; name: string; sku: string; totalQuantity: number }>())

    const topProducts = Array.from(productStats.values())
        .sort((a, b) => b.totalQuantity - a.totalQuantity)
        .slice(0, 5)

    return {
        summary: {
            totalOrders: orders.length,
            totalRevenue: revenue,
        },
        ordersByStatus,
        topProducts,
        lowStockProducts,
    }
}
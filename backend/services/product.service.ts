import { prisma } from "../database/prisma"
import { ProductRequest } from "../types/product"
import { sendLowStockAlertEmail } from "../emails/low-stock-alert"

export const shouldSendLowStockAlert = (
    previousProduct: { quantityInStock: number; lowStockThreshold: number | null; lowStockAlertSentAt: Date | null } | null,
    updatedProduct: {
        quantityInStock: number
        lowStockThreshold: number | null
        supplierEmail: string | null
        name: string
        sku: string
    }
) => {
    if (!previousProduct) return false

    const previousQuantity = previousProduct.quantityInStock ?? 0
    const nextQuantity = updatedProduct.quantityInStock ?? 0
    const threshold = updatedProduct.lowStockThreshold ?? 0

    const crossedIntoLowStock = !!updatedProduct.supplierEmail && previousQuantity > threshold && nextQuantity <= threshold
    const alreadySentRecently = !!previousProduct.lowStockAlertSentAt && nextQuantity <= threshold

    return crossedIntoLowStock && !alreadySentRecently
}

export const getProducts = async (businessId: string, page: number, pageSize: number) => {
    const skip = (page - 1) * pageSize;

    const [data, total] = await Promise.all([
        prisma.product.findMany({
            where: { businessId },
            skip,
            take: pageSize,
            orderBy: { name: "asc" },
        }),
        prisma.product.count({ where: { businessId } }),
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
};
export const searchProducts = async (query: string, businessId:string) => {
    return await prisma.product.findMany({
        where: {
            businessId,
            OR: [
                { name: { contains: query, mode: 'insensitive' } },
                { sku: { contains: query, mode: 'insensitive' } },
                { description: { contains: query, mode: 'insensitive' } },
            ],
        },
        orderBy: { name: 'asc' },
    })
}

export const getProductById = async (id: string, businessId: string) => {
    return await prisma.product.findFirst({ where: { id, businessId } })
}

export const getProductByName = async (name: string, businessId: string) => {
    return await prisma.product.findFirst({ where: { name, businessId } })
}

export const postProducts = async (data: ProductRequest, businessId: string) => {
    return await prisma.product.create({ data: { ...data, businessId } })
}

export const updateProducts = async (id: string, businessId: string, data: Partial<ProductRequest>) => {
    const previousProduct = await prisma.product.findFirst({ where: { id, businessId } })

    const updatedProduct = await prisma.product.update({ where: { id, businessId }, data })

    const threshold = updatedProduct.lowStockThreshold ?? previousProduct?.lowStockThreshold ?? 0

    if (updatedProduct.quantityInStock > threshold) {
        await prisma.product.update({
            where: { id, businessId },
            data: { lowStockAlertSentAt: null },
        })
    }

    if (shouldSendLowStockAlert(previousProduct, updatedProduct)) {
        await sendLowStockAlertEmail({
            name: updatedProduct.name,
            sku: updatedProduct.sku,
            quantityInStock: updatedProduct.quantityInStock,
            lowStockThreshold: updatedProduct.lowStockThreshold,
            supplierEmail: updatedProduct.supplierEmail,
            baseStock: 20,
        })

        await prisma.product.update({
            where: { id, businessId },
            data: {
                lowStockAlertSentAt: new Date(),
            },
        })
    }

    return updatedProduct
}

export const deleteProducts = async (data: {
    id: string
    businessId: string
}) => {
    return await prisma.product.delete({ where: { id: data.id, businessId: data.businessId } })
}

import { prisma } from "../database/prisma"
import { ProductRequest } from "../types/product"


export const getProducts = async (page: number, pageSize: number) => {
    const skip = (page - 1) * pageSize;

    const [data, total] = await Promise.all([
        prisma.product.findMany({
            skip,
            take: pageSize,
            orderBy: { name: "asc" },
        }),
        prisma.product.count(),
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
export const searchProducts = async (query: string) => {
    return await prisma.product.findMany({
        where: {
            OR: [
                { name: { contains: query, mode: 'insensitive' } },
                { sku: { contains: query, mode: 'insensitive' } },
                { description: { contains: query, mode: 'insensitive' } },
            ],
        },
        orderBy: { name: 'asc' },
    })
}

export const getProductById = async (id: string) => {
    return await prisma.product.findUnique({ where: { id } })
}

export const getProductByName = async (name: string) => {
    return await prisma.product.findFirst({ where: { name } })
}

export const postProducts = async (data: ProductRequest) => {
    return await prisma.product.create({ data })
}

export const updateProducts = async (id: string, data: Partial<ProductRequest>) => {
    return await prisma.product.update({ where: { id }, data })
}

export const deleteProducts = async (data: {
    id: string
}) => {
    return await prisma.product.delete({ where: { id: data.id } })
}

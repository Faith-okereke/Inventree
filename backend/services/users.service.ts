import { prisma } from "../database/prisma"
import { Prisma } from "../generated/prisma/client"

export const getAllUsersService = async (page: number, pageSize: number) => {
    const skip = (page - 1) * pageSize;

    const [data, total] = await Promise.all([
        prisma.user.findMany({
            where: { deletedAt: null },
            skip,
            take: pageSize,
            orderBy: { createdAt: "desc" },
            omit: { password: true },
        }),
        prisma.user.count(),
    ]);
    return {
        data,
        pagination: {
            page,
            pageSize,
            total,
            totalPages: Math.ceil(total / pageSize)
        }
    }
}
export const getUserByIdService = (id: string) => {
    return prisma.user.findFirst({
        where: {
            id,
            deletedAt: null
        },
        omit: { password: true }
    })
}
export const getUserByEmailService = (email: string) => {
    return prisma.user.findFirst({
        where: {
            email,
            deletedAt: null
        }
    })
}
export const createUserService = (data: { email: string, name: string, password: string, role?: string }) => {
    return prisma.user.create({
        data,
        omit: { password: true }
    })
}
export const updateUserService = (id: string, data: { email?: string, name?: string, role?: string }) => {
    return prisma.user.update({
        where: { id },
        data,
        omit: { password: true }
    })
}
export const deleteUserService = (id: string) => {
    return prisma.$transaction(async (tx: Prisma.TransactionClient) => {
        await tx.user.update({
            where: { id },
            data: {
                deletedAt: new Date()
            }
        })
    })
}
import { prisma } from "../database/prisma"

export const getAllUsersService = () => {
    return prisma.user.findMany({
        where: {
            deletedAt: null
        },
        omit: { password: true }
    })
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
    return prisma.$transaction(async (tx) => {
        await tx.user.update({
            where: { id },
            data: {
                deletedAt: new Date()
            }
        })
    })
}

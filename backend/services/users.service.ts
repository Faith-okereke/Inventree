import { prisma } from "../database/prisma"
import { Prisma } from "../generated/prisma/client"

export type UserListFilters = {
    role?: string
    status?: string
    search?: string
}

const userInclude = {
    memberships: {
        select: {
            id: true,
            role: true,
            businessId: true,
        },
    },
} as const

export const getAllUsersService = async (
    businessId: string,
    page: number,
    pageSize: number,
    filters: UserListFilters = {},
) => {
    const skip = (page - 1) * pageSize;
    const where: Prisma.UserWhereInput = {};

    where.memberships = {
        some: {
            businessId,
            ...(filters.role && filters.role !== "all" ? { role: filters.role as "admin" | "staff" } : {}),
        },
    }

    if (filters.status === "active") {
        where.deletedAt = null;
    } else if (filters.status === "inactive") {
        where.deletedAt = { not: null };
    }

    if (filters.search?.trim()) {
        const search = filters.search.trim();
        where.OR = [
            { name: { contains: search, mode: "insensitive" } },
            { email: { contains: search, mode: "insensitive" } },
        ];
    }

    const [data, total] = await Promise.all([
        prisma.user.findMany({
            where,
            skip,
            take: pageSize,
            orderBy: { createdAt: "desc" },
            omit: { password: true },
            include: userInclude,
        }),
        prisma.user.count({ where }),
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
export const getUserByIdService = (id: string, businessId: string) => {
    return prisma.user.findFirst({
        where: {
            id,
            deletedAt: null,
            memberships: { some: { businessId } },
        },
        omit: { password: true },
        include: userInclude,
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
export const createUserService = (data: { email: string, name: string, password: string, role?: "admin" | "staff", businessId: string }) => {
    const { businessId, role, ...userData } = data
    return prisma.user.create({
        data: {
            ...userData,
            memberships: {
                create: {
                    businessId,
                    role: role || "staff",
                },
            },
        },
        omit: { password: true },
        include: userInclude,
    })
}
export const updateUserService = async (id: string, businessId: string, data: { email?: string, name?: string, role?: "admin" | "staff" }) => {
    const existingUser = await getUserByIdService(id, businessId)
    if (!existingUser) {
        return null
    }

    const { role, ...userData } = data
    return prisma.user.update({
        where: { id },
        data: {
            ...userData,
            ...(role ? {
                memberships: {
                    update: {
                        where: { userId_businessId: { userId: id, businessId } },
                        data: { role },
                    },
                },
            } : {}),
        },
        omit: { password: true },
        include: userInclude,
    })
}
export const deleteUserService = async (id: string, businessId: string) => {
    const existingUser = await getUserByIdService(id, businessId)
    if (!existingUser) {
        return null
    }

    return prisma.$transaction(async (tx: Prisma.TransactionClient) => {
        await tx.user.update({
            where: { id },
            data: {
                deletedAt: new Date()
            }
        })
        return true
    })
}

import { prisma } from "../database/prisma"
import { Prisma } from "../generated/prisma/client"
import type { RegisterRequest } from "../types/auth"

export const registerService = async (data: RegisterRequest) => {
  return prisma.$transaction(async (tx) => {
    const business = await tx.business.create({
      data: { name: `${data.name}'s Business` },
    })

    return tx.user.create({
      data: {
        email: data.email,
        name: data.name,
        password: data.password,
        provider: "local",
        memberships: {
          create: {
            businessId: business.id,
            role: "admin",
          },
        },
      },
      include: {
        memberships: {
          include: { business: true },
        },
      },
    })
  })
}

export const upsertGoogleUser = async (data: {
  email: string
  name: string
  providerId: string
  avatar?: string | null
}) => {
  return prisma.$transaction(async (tx) => {
    const existingUser = await tx.user.findFirst({
      where: { email: data.email, deletedAt: null },
      include: { memberships: { include: { business: true } } },
    })

    const user = existingUser
      ? await tx.user.update({
          where: { id: existingUser.id },
          data: {
            name: data.name,
            provider: "google",
            providerId: data.providerId,
            avatar: data.avatar ?? existingUser.avatar,
          },
          include: { memberships: { include: { business: true } } },
        })
      : await tx.user.create({
          data: {
            name: data.name,
            email: data.email,
            password: null,
            provider: "google",
            providerId: data.providerId,
            avatar: data.avatar ?? null,
          },
          include: { memberships: { include: { business: true } } },
        })
    
    if (user.memberships.length > 0) return user

    const business = await tx.business.create({
      data: { name: `${data.name}'s Business` },
    })
    await tx.membership.create({
      data: { userId: user.id, businessId: business.id, role: "admin" },
    })

    return tx.user.findUniqueOrThrow({
      where: { id: user.id },
      include: { memberships: { include: { business: true } } },
    })
  })
}

export const getUserService = async (data: { email: string }) => {
  return prisma.user.findFirst({
    where: {
      email: data.email,
      deletedAt: null,
    },
    include: {
      memberships: {
        include: { business: true }
      }
    }
  }
  )
}

export const getUserById = async (id: string) => {
  return prisma.user.findFirst({
    where: {
      id,
      deletedAt: null
    },
    include: {
      memberships: {
        include: {
          business: true
        }
      }
    }
  })
}

export const createPasswordResetToken = async (userId: string, tokenHash: string, expiresAt: Date) => {
  return prisma.passwordResetToken.upsert({
    where: { userId },
    update: { tokenHash, expiresAt },
    create: { userId, tokenHash, expiresAt }
  })
}

export const verifyPasswordResetToken = async (tokenHash: string) => {
  return prisma.passwordResetToken.findUnique({
    where: { tokenHash },
    include: { user: true }
  })
}

export const updateUserPassword = async (userId: string, newHashedPassword: string) => {
  return prisma.user.update({
    where: { id: userId },
    data: {
      password: newHashedPassword
    }
  })
}

export const softDeleteUser = async (userId: string) => {
  return prisma.$transaction(async (tx: Prisma.TransactionClient) => {
    const user = await tx.user.update({
      where: { id: userId },
      data: {
        deletedAt: new Date()
      }
    })

    await tx.passwordResetToken.deleteMany({
      where: { userId }
    })

    return user
  })
}

export const consumePasswordResetToken = async (tokenHash: string) => {
  return prisma.passwordResetToken.delete({
    where: { tokenHash }
  })
}

export const logoutUserService = async ({ userId }: { userId: string }) => {
  return prisma.user.findUnique({
    where: { id: userId }
  })
}
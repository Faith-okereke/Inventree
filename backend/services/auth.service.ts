import { prisma } from "../database/prisma"
import { Prisma } from "../generated/prisma/client"
import type { RegisterRequest } from "../types/auth"

export const registerService = async (data: RegisterRequest) => {
  return prisma.user.create({
    data: {
      ...data,
      provider: "local",
    },
  })
}

export const upsertGoogleUser = async (data: {
  email: string
  name: string
  providerId: string
  avatar?: string | null
}) => {
  const existingUser = await prisma.user.findUnique({ where: { email: data.email } })

  if (existingUser) {
    return prisma.user.update({
      where: { id: existingUser.id },
      data: {
        name: data.name,
        provider: "google",
        providerId: data.providerId,
        avatar: data.avatar ?? existingUser.avatar,
      },
    })
  }

  return prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      password: null,
      provider: "google",
      providerId: data.providerId,
      avatar: data.avatar ?? null,
    },
  })
}

export const getUserService = async (data: { email: string }) => {
  return prisma.user.findFirst({
    where: {
      email: data.email,
      deletedAt: null
    }
  })
}

export const getUserById = async (id: string) => {
  return prisma.user.findFirst({
    where: {
      id,
      deletedAt: null
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
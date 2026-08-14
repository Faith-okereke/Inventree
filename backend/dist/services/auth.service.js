"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logoutUserService = exports.consumePasswordResetToken = exports.softDeleteUser = exports.updateUserPassword = exports.verifyPasswordResetToken = exports.createPasswordResetToken = exports.getUserById = exports.getUserService = exports.registerService = void 0;
const prisma_1 = require("../database/prisma");
const registerService = async (data) => {
    return prisma_1.prisma.user.create({ data });
};
exports.registerService = registerService;
const getUserService = async (data) => {
    return prisma_1.prisma.user.findFirst({
        where: {
            email: data.email,
            deletedAt: null
        }
    });
};
exports.getUserService = getUserService;
const getUserById = async (id) => {
    return prisma_1.prisma.user.findFirst({
        where: {
            id,
            deletedAt: null
        }
    });
};
exports.getUserById = getUserById;
const createPasswordResetToken = async (userId, tokenHash, expiresAt) => {
    return prisma_1.prisma.passwordResetToken.upsert({
        where: { userId },
        update: { tokenHash, expiresAt },
        create: { userId, tokenHash, expiresAt }
    });
};
exports.createPasswordResetToken = createPasswordResetToken;
const verifyPasswordResetToken = async (tokenHash) => {
    return prisma_1.prisma.passwordResetToken.findUnique({
        where: { tokenHash },
        include: { user: true }
    });
};
exports.verifyPasswordResetToken = verifyPasswordResetToken;
const updateUserPassword = async (userId, newHashedPassword) => {
    return prisma_1.prisma.user.update({
        where: { id: userId },
        data: {
            password: newHashedPassword
        }
    });
};
exports.updateUserPassword = updateUserPassword;
const softDeleteUser = async (userId) => {
    return prisma_1.prisma.$transaction(async (tx) => {
        const user = await tx.user.update({
            where: { id: userId },
            data: {
                deletedAt: new Date()
            }
        });
        await tx.passwordResetToken.deleteMany({
            where: { userId }
        });
        return user;
    });
};
exports.softDeleteUser = softDeleteUser;
const consumePasswordResetToken = async (tokenHash) => {
    return prisma_1.prisma.passwordResetToken.delete({
        where: { tokenHash }
    });
};
exports.consumePasswordResetToken = consumePasswordResetToken;
const logoutUserService = async ({ userId }) => {
    return prisma_1.prisma.user.findUnique({
        where: { id: userId }
    });
};
exports.logoutUserService = logoutUserService;

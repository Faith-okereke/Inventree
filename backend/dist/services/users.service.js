"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUserService = exports.updateUserService = exports.createUserService = exports.getUserByEmailService = exports.getUserByIdService = exports.getAllUsersService = void 0;
const prisma_1 = require("../database/prisma");
const getAllUsersService = () => {
    return prisma_1.prisma.user.findMany({
        where: {
            deletedAt: null
        },
        omit: { password: true }
    });
};
exports.getAllUsersService = getAllUsersService;
const getUserByIdService = (id) => {
    return prisma_1.prisma.user.findFirst({
        where: {
            id,
            deletedAt: null
        },
        omit: { password: true }
    });
};
exports.getUserByIdService = getUserByIdService;
const getUserByEmailService = (email) => {
    return prisma_1.prisma.user.findFirst({
        where: {
            email,
            deletedAt: null
        }
    });
};
exports.getUserByEmailService = getUserByEmailService;
const createUserService = (data) => {
    return prisma_1.prisma.user.create({
        data,
        omit: { password: true }
    });
};
exports.createUserService = createUserService;
const updateUserService = (id, data) => {
    return prisma_1.prisma.user.update({
        where: { id },
        data,
        omit: { password: true }
    });
};
exports.updateUserService = updateUserService;
const deleteUserService = (id) => {
    return prisma_1.prisma.$transaction(async (tx) => {
        await tx.user.update({
            where: { id },
            data: {
                deletedAt: new Date()
            }
        });
    });
};
exports.deleteUserService = deleteUserService;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProducts = exports.updateProducts = exports.postProducts = exports.getProductByName = exports.getProductById = exports.searchProducts = exports.getProducts = void 0;
const prisma_1 = require("../database/prisma");
const getProducts = async () => {
    return await prisma_1.prisma.product.findMany();
};
exports.getProducts = getProducts;
const searchProducts = async (query) => {
    return await prisma_1.prisma.product.findMany({
        where: {
            OR: [
                { name: { contains: query, mode: 'insensitive' } },
                { sku: { contains: query, mode: 'insensitive' } },
                { description: { contains: query, mode: 'insensitive' } },
            ],
        },
        orderBy: { name: 'asc' },
    });
};
exports.searchProducts = searchProducts;
const getProductById = async (id) => {
    return await prisma_1.prisma.product.findUnique({ where: { id } });
};
exports.getProductById = getProductById;
const getProductByName = async (name) => {
    return await prisma_1.prisma.product.findFirst({ where: { name } });
};
exports.getProductByName = getProductByName;
const postProducts = async (data) => {
    return await prisma_1.prisma.product.create({ data });
};
exports.postProducts = postProducts;
const updateProducts = async (id, data) => {
    return await prisma_1.prisma.product.update({ where: { id }, data });
};
exports.updateProducts = updateProducts;
const deleteProducts = async (data) => {
    return await prisma_1.prisma.product.delete({ where: { id: data.id } });
};
exports.deleteProducts = deleteProducts;

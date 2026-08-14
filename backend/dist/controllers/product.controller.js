"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTheProduct = exports.updateTheProduct = exports.createProduct = exports.getTheProduct = exports.searchTheProducts = exports.getAllProducts = void 0;
const product_service_1 = require("../services/product.service");
const getAllProducts = async (req, res) => {
    try {
        const products = await (0, product_service_1.getProducts)();
        return res.status(200).json({
            status: 200,
            data: products
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            error: "Internal Server Error occured"
        });
    }
};
exports.getAllProducts = getAllProducts;
const searchTheProducts = async (req, res) => {
    const query = typeof req.query.q === 'string' ? req.query.q.trim() : '';
    if (!query) {
        return res.status(400).json({ message: 'Search query `q` is required.' });
    }
    try {
        const products = await (0, product_service_1.searchProducts)(query);
        return res.status(200).json({
            status: 200,
            data: products
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            error: "Internal Server Error occured"
        });
    }
};
exports.searchTheProducts = searchTheProducts;
const getTheProduct = async (req, res) => {
    const { id: productId } = req.params;
    try {
        const product = await (0, product_service_1.getProductById)(productId);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        return res.status(200).json({ status: 200, data: product });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Internal Server Error occured" });
    }
};
exports.getTheProduct = getTheProduct;
const createProduct = async (req, res) => {
    try {
        const existingByName = await (0, product_service_1.getProductByName)(req.body.name);
        if (existingByName) {
            return res.status(400).json({ message: 'A product with this name already exists.' });
        }
        const newProduct = await (0, product_service_1.postProducts)(req.body);
        return res.status(201).json({ status: 201, data: newProduct });
    }
    catch (error) {
        if (error.code === 'P2002') {
            const target = error.meta?.target;
            if (Array.isArray(target) && target.includes('name')) {
                return res.status(400).json({ message: 'A product with this name already exists.' });
            }
            if (Array.isArray(target) && target.includes('sku')) {
                return res.status(400).json({ message: 'A product with this SKU already exists.' });
            }
        }
        console.log(error);
        return res.status(500).json({ error: "Internal Server Error occurred" });
    }
};
exports.createProduct = createProduct;
const updateTheProduct = async (req, res) => {
    const { id: productId } = req.params;
    try {
        const existingProduct = await (0, product_service_1.getProductById)(productId);
        if (!existingProduct) {
            return res.status(404).json({ message: "Product not found" });
        }
        if (req.body.name && req.body.name !== existingProduct.name) {
            const duplicateName = await (0, product_service_1.getProductByName)(req.body.name);
            if (duplicateName) {
                return res.status(400).json({ message: 'A product with this name already exists.' });
            }
        }
        const updatedProduct = await (0, product_service_1.updateProducts)(productId, req.body);
        return res.status(200).json({ status: 200, data: updatedProduct });
    }
    catch (error) {
        if (error.code === 'P2002') {
            const target = error.meta?.target;
            if (Array.isArray(target) && target.includes('name')) {
                return res.status(400).json({ message: 'A product with this name already exists.' });
            }
            if (Array.isArray(target) && target.includes('sku')) {
                return res.status(400).json({ message: 'A product with this SKU already exists.' });
            }
        }
        console.log(error);
        return res.status(500).json({ error: "Internal Server Error occurred" });
    }
};
exports.updateTheProduct = updateTheProduct;
const deleteTheProduct = async (req, res) => {
    const { id: productId } = req.params;
    const existingProduct = await (0, product_service_1.getProductById)(productId);
    if (!existingProduct) {
        return res.status(404).json({ message: "Product not found" });
    }
    await (0, product_service_1.deleteProducts)({ id: productId });
    return res.status(204).send();
};
exports.deleteTheProduct = deleteTheProduct;

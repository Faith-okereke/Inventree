"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTheOrder = exports.updateTheOrder = exports.createTheOrder = exports.getTheOrder = exports.getAllOrders = void 0;
const order_service_1 = require("../services/order.service");
const getAllOrders = async (req, res) => {
    const allowedStatuses = new Set(['pending', 'fulfilled', 'cancelled']);
    try {
        const status = typeof req.query.status === 'string' ? req.query.status : undefined;
        if (status && !allowedStatuses.has(status)) {
            return res.status(400).json({ message: 'Invalid status filter.' });
        }
        const orders = await (0, order_service_1.getOrders)(status);
        return res.status(200).json({ status: 200, data: orders });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};
exports.getAllOrders = getAllOrders;
const getTheOrder = async (req, res) => {
    const { id: orderId } = req.params;
    const user = req.auth;
    try {
        const order = await (0, order_service_1.getOrderById)(orderId);
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }
        if (user?.role !== 'admin' && order.userId !== user?.id) {
            return res.status(403).json({ message: "Forbidden: You do not have permission to view this order." });
        }
        return res.status(200).json({ status: 200, data: order });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};
exports.getTheOrder = getTheOrder;
const createTheOrder = async (req, res) => {
    const user = req.auth;
    const { items } = req.body;
    try {
        const newOrder = await (0, order_service_1.createOrder)({
            userId: user.id,
            items,
            status: 'pending',
        });
        return res.status(201).json({ status: 201, data: newOrder });
    }
    catch (error) {
        if (error.message?.includes('not found')) {
            return res.status(404).json({ message: error.message });
        }
        if (error.message?.includes('Insufficient stock')) {
            return res.status(400).json({ message: error.message });
        }
        console.error(error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};
exports.createTheOrder = createTheOrder;
const updateTheOrder = async (req, res) => {
    const { id: orderId } = req.params;
    const { status } = req.body;
    try {
        const existingOrder = await (0, order_service_1.getOrderById)(orderId);
        if (!existingOrder) {
            return res.status(404).json({ message: "Order not found" });
        }
        const updatedOrder = await (0, order_service_1.updateOrderStatus)(orderId, status);
        return res.status(200).json({ status: 200, data: updatedOrder });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};
exports.updateTheOrder = updateTheOrder;
const deleteTheOrder = async (req, res) => {
    const { id: orderId } = req.params;
    try {
        const existingOrder = await (0, order_service_1.getOrderById)(orderId);
        if (!existingOrder) {
            return res.status(404).json({ message: "Order not found" });
        }
        await (0, order_service_1.deleteOrder)(orderId);
        return res.status(204).send();
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};
exports.deleteTheOrder = deleteTheOrder;

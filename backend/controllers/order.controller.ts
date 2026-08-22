import { Response, Request } from "express"
import { createOrder, deleteOrder, getOrderById, getOrders, updateOrderStatus } from "../services/order.service"
import { AuthenticatedRequest } from "../middleware/require-auth.middleware"

const paginationParams = (req: Request) => {
    const page = Math.max(Number(req.query.page) || 1, 1);
    const pageSize = Math.min(
        Math.max(Number(req.query.pageSize) || 10, 1),
        100,
    );

    return { page, pageSize };
}
export const getAllOrders = async (req: Request, res: Response) => {
    const allowedStatuses = new Set(['pending', 'fulfilled', 'cancelled'])
    try {
        const { page, pageSize } = paginationParams(req);
        const status = typeof req.query.status === 'string' ? req.query.status : undefined
        if (status && !allowedStatuses.has(status)) {
            return res.status(400).json({ message: 'Invalid status filter.' })
        }

        const orders = await getOrders(status, page, pageSize)
        return res.status(200).json({
            status: 200,
            data: orders.data,
            pagination: orders.pagination,
        })
    } catch (error) {
        console.error(error)
        return res.status(500).json({ error: "Internal Server Error" })
    }
}

export const getTheOrder = async (req: Request, res: Response) => {
    const { id: orderId } = req.params
    const user = (req as AuthenticatedRequest).auth

    try {
        const order = await getOrderById(orderId)

        if (!order) {
            return res.status(404).json({ message: "Order not found" })
        }

        if (user?.role !== 'admin' && order.userId !== user?.id) {
            return res.status(403).json({ message: "Forbidden: You do not have permission to view this order." })
        }

        return res.status(200).json({ status: 200, data: order })
    } catch (error) {
        console.error(error)
        return res.status(500).json({ error: "Internal Server Error" })
    }
}

export const createTheOrder = async (req: Request, res: Response) => {
    const user = (req as AuthenticatedRequest).auth
    const { items } = req.body

    try {
        const newOrder = await createOrder({
            userId: user!.id,
            items,
            status: 'pending',
        })

        return res.status(201).json({ status: 201, data: newOrder })
    } catch (error: any) {
        if (error.message?.includes('not found')) {
            return res.status(404).json({ message: error.message })
        }
        if (error.message?.includes('Insufficient stock')) {
            return res.status(400).json({ message: error.message })
        }
        console.error(error)
        return res.status(500).json({ error: "Internal Server Error" })
    }
}
export const updateTheOrder = async (req: Request, res: Response) => {
    const { id: orderId } = req.params
    const { status } = req.body

    try {
        const existingOrder = await getOrderById(orderId)
        if (!existingOrder) {
            return res.status(404).json({ message: "Order not found" })
        }

        const updatedOrder = await updateOrderStatus(orderId, status)
        return res.status(200).json({ status: 200, data: updatedOrder })
    } catch (error) {
        console.error(error)
        return res.status(500).json({ error: "Internal Server Error" })
    }
}
export const deleteTheOrder = async (req: Request, res: Response) => {
    const { id: orderId } = req.params

    try {
        const existingOrder = await getOrderById(orderId)
        if (!existingOrder) {
            return res.status(404).json({ message: "Order not found" })
        }

        await deleteOrder(orderId)
        return res.status(204).send()
    } catch (error) {
        console.error(error)
        return res.status(500).json({ error: "Internal Server Error" })
    }
}
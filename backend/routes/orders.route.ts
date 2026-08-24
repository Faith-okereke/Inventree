import { Router } from "express"
import { requireAuth } from "../middleware/require-auth.middleware"
import { requireRole } from "../middleware/role.middleware"
import { validate } from "../middleware/validate.middleware"
import { createOrderSchema, orderIdSchema, updateOrderStatusSchema } from "../middleware/order.middleware"
import { getAllOrders, getTheOrder, createTheOrder, updateTheOrder, deleteTheOrder } from "../controllers/order.controller"

const router = Router()

router.get('/all', requireAuth, getAllOrders)

router.get('/:id', requireAuth, validate(orderIdSchema, { source: 'params' }), getTheOrder )

router.post('/create', requireAuth, validate(createOrderSchema), createTheOrder )

router.patch('/:id/status', requireAuth, requireRole('admin'), validate(orderIdSchema, { source: 'params' }), validate(updateOrderStatusSchema), updateTheOrder )

router.delete('/:id', requireAuth, requireRole('admin'), validate(orderIdSchema, { source: 'params' }), deleteTheOrder)

export default router

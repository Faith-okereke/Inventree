import { Router } from "express"
import { validate } from "../middleware/validate.middleware"
import { productIdSchema, productRequestSchema } from "../middleware/product.middleware"
import { requireRole } from "../middleware/role.middleware"
import { getAllProducts, searchTheProducts, getTheProduct, createProduct, updateTheProduct, deleteTheProduct } from "../controllers/product.controller"
import { requireAuth } from "../middleware/require-auth.middleware"

const router = Router()

router.get('/all',
     requireAuth,
     getAllProducts)

router.get('/search', requireAuth, searchTheProducts)

router.get(
    "/:id",
    requireAuth,
    validate(productIdSchema, { source: 'params' }),
    getTheProduct

)

router.post(
    '/create',
    requireAuth,
    requireRole('admin'),
    validate(productRequestSchema),
    createProduct
)

router.patch(
    '/:id',
    requireAuth,
    requireRole('admin'),
    validate(productIdSchema, { source: 'params' }),
    validate(productRequestSchema),
    updateTheProduct
)

router.delete(
    '/:id',
    requireAuth,
    requireRole('admin'),
    validate(productIdSchema, { source: 'params' }),
    deleteTheProduct
    )

export default router

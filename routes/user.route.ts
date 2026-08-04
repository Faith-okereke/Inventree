import { Router } from "express"
import { validate } from "../middleware/validate.middleware"
import { userIdSchema, createUserSchema, updateUserSchema } from "../middleware/user.middleware"
import { requireAuth } from "../middleware/require-auth.middleware"
import { requireRole } from "../middleware/role.middleware"
import { getAllUsers, getUser, createUser, updateUser, deleteUser } from "../controllers/user.controller"

const router = Router()

router.get('/all', requireAuth, requireRole('admin'), getAllUsers)

router.get(
    '/:id',
    requireAuth,
    requireRole('admin'),
    validate(userIdSchema, { source: 'params' }),
    getUser
)

router.post(
    '/create',
    requireAuth,
    requireRole('admin'),
    validate(createUserSchema),
    createUser
)

router.patch(
    '/:id',
    requireAuth,
    requireRole('admin'),
    validate(userIdSchema, { source: 'params' }),
    validate(updateUserSchema),
    updateUser
)

router.delete(
    '/:id',
    requireAuth,
    requireRole('admin'),
    validate(userIdSchema, { source: 'params' }),
    deleteUser
)

export default router

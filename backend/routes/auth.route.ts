import { Router } from "express"
import { validate } from "../middleware/validate.middleware"
import { loginRequestSchema, registerRequestSchema } from "../middleware/auth.middleware"
import { requireAuth } from "../middleware/require-auth.middleware"
import { deleteUserProfile, forgotPassword, getUserProfile, loginUser, registerUser, resetUserPassword, verifyUserPassword } from "../controllers/auth.controller"
import { requireRole } from "../middleware/role.middleware"
import { forgotPasswordLimiter, registerLimiter, loginLimiter } from "../middleware/rate-limiter.middleware"

const router = Router()

router.post('/register', validate(registerRequestSchema, { errorFormatter: (issues) => ({ error: issues[0]?.message ?? 'Invalid request body' }) }), registerLimiter, registerUser)

router.post('/login', validate(loginRequestSchema, { errorFormatter: (issues) => ({ error: issues[0]?.message ?? 'Invalid request body' }) }), loginLimiter, loginUser)

router.post('/forgot-password', forgotPasswordLimiter, forgotPassword)

router.get('/verify-password', verifyUserPassword)

router.post('/reset-password', resetUserPassword)

router.get('/me', requireAuth, getUserProfile)

router.delete('/me', requireAuth, requireRole("admin"), deleteUserProfile)

export default router

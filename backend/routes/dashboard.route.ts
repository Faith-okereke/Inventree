import { Request, Response, Router } from "express"
import { requireRole } from "../middleware/role.middleware"
import { getOrderDashboard } from "../services/dashboard.service"
import { requireAuth } from "../middleware/require-auth.middleware"

const router = Router()
router.get('/', requireAuth, requireRole('admin'), async (req: Request, res: Response) => {
    try {
        const dashboard = await getOrderDashboard()
        return res.status(200).json({ status: 200, data: dashboard })
    } catch (error) {
        console.error(error)
        return res.status(500).json({ error: "Internal Server Error" })
    }
})
export default router 
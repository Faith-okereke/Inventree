import { Request, Response, Router } from "express"
import { getOrderDashboard } from "../services/dashboard.service"
import { AuthenticatedRequest, requireAuth } from "../middleware/require-auth.middleware"

const router = Router()
router.get('/', requireAuth, async (req: Request, res: Response) => {
    try {
        const businessId = (req as AuthenticatedRequest).auth?.businessId
        if (!businessId) {
            return res.status(401).json({ message: "Unauthorized" })
        }

        const dashboard = await getOrderDashboard(businessId)
        return res.status(200).json({ status: 200, data: dashboard })
    } catch (error) {
        console.error(error)
        return res.status(500).json({ error: "Internal Server Error" })
    }
})
export default router 
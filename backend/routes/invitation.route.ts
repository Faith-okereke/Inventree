import { Router } from "express";
import { acceptInvitation, declineInvitation, revokeInvitation, sendInvitation } from "../controllers/invitation.controller";
import { requireAuth } from "../middleware/require-auth.middleware";
import { requireRole } from "../middleware/role.middleware";

const router = Router()

router.post('/send', requireAuth, requireRole('admin'), sendInvitation)

router.post('/accept', acceptInvitation)

router.post('/decline', declineInvitation)

router.post('/revoke/:invitationId', requireAuth, requireRole('admin'), revokeInvitation)

export default router
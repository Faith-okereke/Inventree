import { Router } from "express";
import { acceptInvitation, declineInvitation, revokeInvitation, sendInvitation } from "../controllers/invitation.controller";

const router = Router()

router.post('/send', sendInvitation)

router.post('/accept', acceptInvitation)

router.post('/decline', declineInvitation)

router.post('/revoke/:invitationId', revokeInvitation)

export default router
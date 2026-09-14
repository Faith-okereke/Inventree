import { Request, Response } from "express";
import { sendInvitationService, acceptInvitationService, declineInvitationService, revokeInvitationService } from "../services/invitation.service";
import crypto from "node:crypto";
import { AuthenticatedRequest } from "../middleware/require-auth.middleware";
import { sendInvitationEmail } from "../emails/invitation";
import jwt from "jsonwebtoken";



export const sendInvitation = async (req: Request, res: Response) => {
    try {
        const { email, role = "staff" } = req.body;

        if (!email) {
            return res.status(400).json({ message: "Email is required" });
        }

        const rawToken = crypto.randomBytes(32).toString("hex");
        const tokenHash = crypto.createHash("sha256").update(rawToken).digest("hex");
        const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
        const user = (req as AuthenticatedRequest).auth
        if (!user) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const invitation = await sendInvitationService({
            email,
            role,
            businessId: user.businessId,
            invitedById: user.userId,
            tokenHash,
            expiresAt,
        });

        await sendInvitationEmail(
            {
                to: email,
                token: rawToken,
                inviter: user.name

            }
        );

        return res.status(201).json({
            message: "Invitation sent successfully",
            data: {
                id: invitation.id,
                email: invitation.email,
                role: invitation.role,
                status: invitation.status,
                expiresAt: invitation.expiresAt,
            },
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error occured" });
    }
};
export const acceptInvitation = async (req: Request, res: Response) => {
    try {
        const token = req.params.token
        const { name, password } = req.body

        if (!token) {
            return res.status(400).json({ message: "Token is required" });
        }

        const { user, membership } = await acceptInvitationService({ token, name, password })

        const authToken = jwt.sign(
            { id: user.id, role: membership.role, businessId: membership.businessId },
            process.env.JWT_SECRET as string,
            { expiresIn: '7d' }
        )

        const { password: _, ...safeUser } = user;
        return res.json({ message: "Invitation accepted successfully, Your account is now created!", authToken, safeUser, membership });
    } catch (error: any) {
        switch (error.message) {
            case "INVALID_INVITATION":
                return res.status(400).json({ message: "This invitation is invalid or has already been used" });
            case "INVITATION_EXPIRED":
                return res.status(400).json({ message: "This invitation has expired" });
            case "MISSING_SIGNUP_DETAILS":
                return res.status(400).json({ message: "Name and password are required to create your account" });
            default:
                console.log(error);
                return res.status(500).json({ message: "Internal Server Error occured" });
        }
    }

}
export const declineInvitation = async (req: Request, res: Response) => {
    try {
        const token = req.params.token;

        if (!token) {
            return res.status(400).json({ message: "Token is required" });
        }

        await declineInvitationService(token);

        return res.status(200).json({ message: "Invitation declined" });
    } catch (error: any) {
        switch (error.message) {
            case "INVALID_INVITATION":
                return res.status(400).json({ message: "This invitation is invalid or has already been used" });
            case "INVITATION_EXPIRED":
                return res.status(400).json({ message: "This invitation has expired" });
            default:
                console.log(error);
                return res.status(500).json({ message: "Internal Server Error occured" });
        }
    }
};

export const revokeInvitation = async (req: Request, res: Response) => {
    try {
        const user = (req as AuthenticatedRequest).auth;
        if (!user) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const { invitationId } = req.params;

        await revokeInvitationService(invitationId, user.businessId);

        return res.status(200).json({ message: "Invitation revoked" });
    } catch (error: any) {
        switch (error.message) {
            case "INVITATION_NOT_FOUND":
                return res.status(404).json({ message: "Invitation not found" });
            case "INVITATION_NOT_PENDING":
                return res.status(400).json({ message: "Only pending invitations can be revoked" });
            default:
                console.log(error);
                return res.status(500).json({ message: "Internal Server Error occured" });
        }
    }
};
import { Request, Response } from "express";
import crypto from "node:crypto";
import jwt from "jsonwebtoken";

import { sendPasswordResetEmail } from "../emails/reset-password";
import { AuthenticatedRequest } from "../middleware/require-auth.middleware";
import {
  consumePasswordResetToken,
  createPasswordResetToken,
  getUserService,
  registerService,
  softDeleteUser,
  updateUserPassword,
  verifyPasswordResetToken,
} from "../services/auth.service";
import type {
  LoginRequest,
  RegisterRequest,
  ResetPasswordRequest,
} from "../types/auth";
import { hashPassword, verifyPassword } from "../utils/password";

export const registerUser = async (req: Request, res: Response) => {
    const { email, password, name }: RegisterRequest = req.body;
    try {
        const existingUser = await getUserService({ email })
        if (existingUser) {
            return res.status(400).json({
                message: "That email is already in use. Login with it or use a different email address"
            })
        }

        const hashedPassword = await hashPassword(password)
        const user = await registerService({ email, name, password: hashedPassword })
        const { password: _, ...safeUser } = user
        return res.status(201).json(safeUser)
    } catch (error) {
        console.error(error)
        return res.status(500).json({ message: "Internal server error" })
    }

}
export const loginUser = async (req: Request, res: Response) => {
    const { email, password }: LoginRequest = req.body;
    try {
        const existingUser = await getUserService({ email })
        if (!existingUser) {
            return res.status(401).json({
                message: "Invalid email or password"
            })
        }

        const passwordMatches = await verifyPassword(password, existingUser.password)
        if (!passwordMatches) {
            return res.status(401).json({ message: 'Invalid email or password' })
        }

        const token = jwt.sign(
            { id: existingUser.id, email: existingUser.email, role: existingUser.role, name: existingUser.name },
            process.env.JWT_SECRET as string,
            { expiresIn: '1d' }
        )

        const { password: _, ...safeUser } = existingUser
        return res.status(200).json({ token, user: safeUser })
    } catch (error) {
        console.error(error)
        return res.status(500).json({ message: "Internal server error" })
    }
}

export const forgotPassword = async (req: Request, res: Response) => {
    const { email } = req.body
    try {
        const existingUser = await getUserService({ email })
        if (!existingUser) {
            return res.status(200).json({ message: "If that email exists, a reset link was sent." })
        }
        // GENERATES TOKEN
        const token = crypto.randomBytes(32).toString("hex")
        const tokenHash = crypto.createHash("sha256").update(token).digest("hex")
        const expiresAt = new Date(Date.now() + 1000 * 60 * 30) // 30 minutes
        //SAVE TO DB
        await createPasswordResetToken(existingUser.id, tokenHash, expiresAt)
        //SEND THE EMAIL 
        await sendPasswordResetEmail(existingUser.email, token)

        return res.status(200).json({ status: 200, message: "If that email exists, a reset link was sent." })
    } catch (error) {
        console.error(error)
        return res.status(500).json({ message: "Internal server error" })
    }
}
export const verifyUserPassword = async (req: Request, res: Response) => {
    const { token } = req.query

    try {
        if (!token || typeof token !== "string") {
            return res.status(400).json({ message: "Invalid or expired token" })
        }

        // hash the token 
        const tokenHash = crypto.createHash("sha256").update(token).digest("hex")
        // call the verify service 
        const resetRecord = await verifyPasswordResetToken(tokenHash)
        if (!resetRecord || resetRecord.expiresAt < new Date() || resetRecord.user.deletedAt) {
            return res.status(400).json({ message: "Invalid or expired token" })
        }
        return res.status(200).json({ valid: true })
    } catch (error) {
        console.error(error)
        return res.status(500).json({ message: "Internal server error" })
    }
}
export const resetUserPassword = async (req: Request, res: Response) => {
    const { newPassword, token }: ResetPasswordRequest = req.body;
    try {
        if (!token || !newPassword) {
            return res.status(400).json({ message: "Token and new password are required" })
        }
        if (newPassword.length < 8) {
            return res.status(400).json({ message: "Password must be at least 8 characters" })
        }
        const hashedNewPassword = await hashPassword(newPassword)
        const tokenHash = crypto.createHash("sha256").update(token).digest("hex")
        const resetRecord = await verifyPasswordResetToken(tokenHash)
        if (!resetRecord || resetRecord.user.deletedAt) {
            return res.status(400).json({ message: "Invalid or expired token" })
        }
        await updateUserPassword(resetRecord.userId, hashedNewPassword)
        await consumePasswordResetToken(tokenHash) // Consume the token after successful password reset
        return res.status(200).json({
            status: 200,
            message: "Your password has been reset successfully. Sign in with new password to access account."
        })
    } catch (error) {
        console.error(error)
        return res.status(500).json({ message: "Internal server error" })
    }
}
export const getUserProfile =  async (req: Request, res: Response) => {
    const authReq = req as AuthenticatedRequest
    try {
        const user = await getUserService({ email: authReq?.auth?.email as string })

        if (!user) {
            return res.status(404).json({ message: "User not found" })
        }

        const { password, ...safeUser } = user
        return res.status(200).json({ status: 200, data: safeUser })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Internal Server Error occured" })
    }
}
export const deleteUserProfile = async (req: Request, res: Response) => {
    const authReq = req as AuthenticatedRequest
    try {
        const user = await getUserService({ email: authReq?.auth?.email as string })

        if (!user) {
            return res.status(404).json({ message: "User not found" })
        }

        await softDeleteUser(user.id)
        return res.status(204).send()
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Internal Server Error occured" })
    }
}
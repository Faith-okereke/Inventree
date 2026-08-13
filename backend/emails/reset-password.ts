import { sendEmail } from "../services/email.service.ts"

export const sendPasswordResetEmail = async (to: string, token: string) => {
    const resetUrl = `${process.env.CLIENT_URL}/reset-password?token=${token}`

    const html = `
        <p>We received a request to reset your password.</p>
        <p>Click the button below to reset your password</p>
        <button><a href="${resetUrl}">Reset Password</a></button>

        <p>This link expires in 30 minutes. If you didn't request this, you can ignore this email.</p>
    `

    await sendEmail(to, "Reset your password", html)
}
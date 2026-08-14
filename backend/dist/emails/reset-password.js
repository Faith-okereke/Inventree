"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendPasswordResetEmail = void 0;
const email_service_1 = require("../services/email.service");
const sendPasswordResetEmail = async (to, token) => {
    const resetUrl = `${process.env.CLIENT_URL}/reset-password?token=${token}`;
    const html = `
        <p>We received a request to reset your password.</p>
        <p>Click the button below to reset your password</p>
        <button><a href="${resetUrl}">Reset Password</a></button>

        <p>This link expires in 30 minutes. If you didn't request this, you can ignore this email.</p>
    `;
    await (0, email_service_1.sendEmail)(to, "Reset your password", html);
};
exports.sendPasswordResetEmail = sendPasswordResetEmail;

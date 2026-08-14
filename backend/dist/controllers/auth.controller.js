"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUserProfile = exports.getUserProfile = exports.resetUserPassword = exports.verifyUserPassword = exports.forgotPassword = exports.loginUser = exports.registerUser = void 0;
const password_1 = require("../utils/password");
const auth_service_1 = require("../services/auth.service");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const reset_password_1 = require("../emails/reset-password");
const node_crypto_1 = __importDefault(require("node:crypto"));
const registerUser = async (req, res) => {
    const { email, password, name } = req.body;
    try {
        const existingUser = await (0, auth_service_1.getUserService)({ email });
        if (existingUser) {
            return res.status(400).json({
                status: 400,
                error: "That email is already in use. Login with it or use a different email address"
            });
        }
        const hashedPassword = await (0, password_1.hashPassword)(password);
        const user = await (0, auth_service_1.registerService)({ email, name, password: hashedPassword });
        const { password: _, ...safeUser } = user;
        return res.status(201).json(safeUser);
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};
exports.registerUser = registerUser;
const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const existingUser = await (0, auth_service_1.getUserService)({ email });
        if (!existingUser) {
            return res.status(401).json({
                error: "Invalid email or password"
            });
        }
        const passwordMatches = await (0, password_1.verifyPassword)(password, existingUser.password);
        if (!passwordMatches) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }
        const token = jsonwebtoken_1.default.sign({ id: existingUser.id, email: existingUser.email, role: existingUser.role, name: existingUser.name }, process.env.JWT_SECRET, { expiresIn: '1d' });
        const { password: _, ...safeUser } = existingUser;
        return res.status(200).json({ token, user: safeUser });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};
exports.loginUser = loginUser;
const forgotPassword = async (req, res) => {
    const { email } = req.body;
    try {
        const existingUser = await (0, auth_service_1.getUserService)({ email });
        if (!existingUser) {
            return res.status(200).json({ message: "If that email exists, a reset link was sent." });
        }
        // GENERATES TOKEN
        const token = node_crypto_1.default.randomBytes(32).toString("hex");
        const tokenHash = node_crypto_1.default.createHash("sha256").update(token).digest("hex");
        const expiresAt = new Date(Date.now() + 1000 * 60 * 30); // 30 minutes
        //SAVE TO DB
        await (0, auth_service_1.createPasswordResetToken)(existingUser.id, tokenHash, expiresAt);
        //SEND THE EMAIL 
        await (0, reset_password_1.sendPasswordResetEmail)(existingUser.email, token);
        return res.status(200).json({ status: 200, message: "If that email exists, a reset link was sent." });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};
exports.forgotPassword = forgotPassword;
const verifyUserPassword = async (req, res) => {
    const { token } = req.query;
    try {
        if (!token || typeof token !== "string") {
            return res.status(400).json({ message: "Invalid or expired token" });
        }
        // hash the token 
        const tokenHash = node_crypto_1.default.createHash("sha256").update(token).digest("hex");
        // call the verify service 
        const resetRecord = await (0, auth_service_1.verifyPasswordResetToken)(tokenHash);
        if (!resetRecord || resetRecord.expiresAt < new Date() || resetRecord.user.deletedAt) {
            return res.status(400).json({ message: "Invalid or expired token" });
        }
        return res.status(200).json({ valid: true });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};
exports.verifyUserPassword = verifyUserPassword;
const resetUserPassword = async (req, res) => {
    const { newPassword, token } = req.body;
    try {
        if (!token || !newPassword) {
            return res.status(400).json({ message: "Token and new password are required" });
        }
        if (newPassword.length < 8) {
            return res.status(400).json({ message: "Password must be at least 8 characters" });
        }
        const hashedNewPassword = await (0, password_1.hashPassword)(newPassword);
        const tokenHash = node_crypto_1.default.createHash("sha256").update(token).digest("hex");
        const resetRecord = await (0, auth_service_1.verifyPasswordResetToken)(tokenHash);
        if (!resetRecord || resetRecord.user.deletedAt) {
            return res.status(400).json({ message: "Invalid or expired token" });
        }
        await (0, auth_service_1.updateUserPassword)(resetRecord.userId, hashedNewPassword);
        await (0, auth_service_1.consumePasswordResetToken)(tokenHash); // Consume the token after successful password reset
        return res.status(200).json({
            status: 200,
            message: "Your password has been reset successfully. Sign in with new password to access account."
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};
exports.resetUserPassword = resetUserPassword;
const getUserProfile = async (req, res) => {
    const authReq = req;
    try {
        const user = await (0, auth_service_1.getUserService)({ email: authReq?.auth?.email });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        const { password, ...safeUser } = user;
        return res.status(200).json({ status: 200, data: safeUser });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            error: "Internal Server Error occured"
        });
    }
};
exports.getUserProfile = getUserProfile;
const deleteUserProfile = async (req, res) => {
    const authReq = req;
    try {
        const user = await (0, auth_service_1.getUserService)({ email: authReq?.auth?.email });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        await (0, auth_service_1.softDeleteUser)(user.id);
        return res.status(204).send();
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            error: "Internal Server Error occured"
        });
    }
};
exports.deleteUserProfile = deleteUserProfile;

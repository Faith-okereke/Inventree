"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAuth = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const requireAuth = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ error: "Missing authorization token" });
    }
    const [scheme, token] = authHeader.split(" ");
    if (scheme !== "Bearer" || !token) {
        return res.status(401).json({ error: "Invalid authorization header" });
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        if (typeof decoded === "string") {
            return res.status(401).json({ error: "Invalid or expired token" });
        }
        ;
        req.auth = decoded;
        next();
    }
    catch {
        return res.status(401).json({ error: "Invalid or expired token" });
    }
};
exports.requireAuth = requireAuth;

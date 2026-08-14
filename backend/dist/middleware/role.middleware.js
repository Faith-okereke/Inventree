"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireRole = void 0;
const requireRole = (role) => {
    return (req, res, next) => {
        const user = req.auth;
        if (user?.role !== role) {
            return res.status(403).json({ message: 'Forbidden: You do not have the required permissions.' });
        }
        next();
    };
};
exports.requireRole = requireRole;

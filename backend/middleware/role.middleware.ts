import { Request, Response, NextFunction } from 'express';
import { AuthenticatedRequest } from './require-auth.middleware';

export const requireRole = (role: 'admin' | 'staff') => {
    return (req: Request, res: Response, next: NextFunction) => {
        const user = (req as AuthenticatedRequest).auth;
        if (user?.role !== role) {
            return res.status(403).json({ message: 'Forbidden: You do not have the required permissions.' });
        }
        next();
    };
};
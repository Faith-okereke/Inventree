import { NextFunction, Request, Response } from "express"
import jwt, { JwtPayload } from "jsonwebtoken"

export interface AuthTokenPayload extends JwtPayload {
    id: string
    email: string
    role: string
    name:string
}

export type AuthenticatedRequest = Request & {
    auth?: AuthTokenPayload
}

export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization

    if (!authHeader) {
        return res.status(401).json({ error: "Missing authorization token" })
    }

    const [scheme, token] = authHeader.split(" ")
    if (scheme !== "Bearer" || !token) {
        return res.status(401).json({ error: "Invalid authorization header" })
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string)

        if (typeof decoded === "string") {
            return res.status(401).json({ error: "Invalid or expired token" })
        }

        ;(req as AuthenticatedRequest).auth = decoded as AuthTokenPayload
        next()
    } catch {
        return res.status(401).json({ error: "Invalid or expired token" })
    }
}
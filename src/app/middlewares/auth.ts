import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import httpStatus from "http-status";
import config from "../../config";

export type JwtPayload = {
    id: number;
    email: string;
    role: "ADMIN" | "USER";
};

declare global {
    namespace Express {
        interface Request {
            user?: JwtPayload;
        }
    }
}

const auth =
    (...roles: string[]) =>
    (req: Request, res: Response, next: NextFunction) => {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            res.status(httpStatus.UNAUTHORIZED).json({
                success: false,
                message: "Authentication required",
            });
            return;
        }

        const token = authHeader.split(" ")[1];

        try {
            const decoded = jwt.verify(token, config.jwt.secret) as JwtPayload;
            req.user = decoded;

            if (roles.length && !roles.includes(decoded.role)) {
                res.status(httpStatus.FORBIDDEN).json({
                    success: false,
                    message:
                        "You do not have permission to perform this action",
                });
                return;
            }

            next();
        } catch {
            res.status(httpStatus.UNAUTHORIZED).json({
                success: false,
                message: "Invalid or expired token",
            });
        }
    };

export default auth;

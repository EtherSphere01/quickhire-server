import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import httpStatus from "http-status";
import config from "../../config";
import { AuthService } from "../modules/auth/auth.service";

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

const COOKIE_OPTIONS_ACCESS = {
    httpOnly: true,
    secure: config.env === "production",
    sameSite: "strict" as const,
    maxAge: 15 * 60 * 1000,
};

const auth =
    (...roles: string[]) =>
    (req: Request, res: Response, next: NextFunction) => {
        const accessToken = req.cookies?.accessToken;
        const refreshToken = req.cookies?.refreshToken;

        if (accessToken) {
            try {
                const decoded = jwt.verify(
                    accessToken,
                    config.jwt.secret,
                ) as JwtPayload;
                req.user = decoded;
                return checkRole(roles, decoded, res, next);
            } catch {
               
            }
        }

        
        if (refreshToken) {
            try {
                const newAccessToken =
                    AuthService.refreshAccessToken(refreshToken);

                res.cookie(
                    "accessToken",
                    newAccessToken,
                    COOKIE_OPTIONS_ACCESS,
                );

                const decoded = jwt.verify(
                    newAccessToken,
                    config.jwt.secret,
                ) as JwtPayload;
                req.user = decoded;
                return checkRole(roles, decoded, res, next);
            } catch {
              
            }
        }

        res.status(httpStatus.UNAUTHORIZED).json({
            success: false,
            message: "Authentication required",
        });
    };

const checkRole = (
    roles: string[],
    decoded: JwtPayload,
    res: Response,
    next: NextFunction,
) => {
    if (roles.length && !roles.includes(decoded.role)) {
        res.status(httpStatus.FORBIDDEN).json({
            success: false,
            message: "You do not have permission to perform this action",
        });
        return;
    }
    next();
};

export default auth;

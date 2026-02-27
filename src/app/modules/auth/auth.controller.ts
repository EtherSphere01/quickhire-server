import { Request, Response } from "express";
import httpStatus from "http-status";
import { AuthService } from "./auth.service";
import config from "../../../config";

const COOKIE_OPTIONS_ACCESS = {
    httpOnly: true,
    secure: config.env === "production",
    sameSite: "strict" as const,
    maxAge: 15 * 60 * 1000, // 15 minutes
};

const COOKIE_OPTIONS_REFRESH = {
    httpOnly: true,
    secure: config.env === "production",
    sameSite: "strict" as const,
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
};

const register = async (req: Request, res: Response) => {
    try {
        const user = await AuthService.register(req.body);
        res.status(httpStatus.CREATED).json({
            success: true,
            message: "User registered successfully",
            data: user,
        });
    } catch (error: any) {
        const status =
            error.message === "Email already registered"
                ? httpStatus.CONFLICT
                : httpStatus.INTERNAL_SERVER_ERROR;
        res.status(status).json({
            success: false,
            message: error.message || "Registration failed",
        });
    }
};

const login = async (req: Request, res: Response) => {
    try {
        const { accessToken, refreshToken, user } = await AuthService.login(
            req.body,
        );

        res.cookie("accessToken", accessToken, COOKIE_OPTIONS_ACCESS);
        res.cookie("refreshToken", refreshToken, COOKIE_OPTIONS_REFRESH);

        res.status(httpStatus.OK).json({
            success: true,
            message: "Login successful",
            data: { user },
        });
    } catch (error: any) {
        const status =
            error.message === "Invalid email or password"
                ? httpStatus.UNAUTHORIZED
                : httpStatus.INTERNAL_SERVER_ERROR;
        res.status(status).json({
            success: false,
            message: error.message || "Login failed",
        });
    }
};

const logout = async (_req: Request, res: Response) => {
    res.clearCookie("accessToken", COOKIE_OPTIONS_ACCESS);
    res.clearCookie("refreshToken", COOKIE_OPTIONS_REFRESH);

    res.status(httpStatus.OK).json({
        success: true,
        message: "Logged out successfully",
    });
};

const refreshToken = async (req: Request, res: Response) => {
    try {
        const token = req.cookies?.refreshToken;

        if (!token) {
            res.status(httpStatus.UNAUTHORIZED).json({
                success: false,
                message: "Refresh token not found",
            });
            return;
        }

        const newAccessToken = AuthService.refreshAccessToken(token);

        res.cookie("accessToken", newAccessToken, COOKIE_OPTIONS_ACCESS);

        res.status(httpStatus.OK).json({
            success: true,
            message: "Access token refreshed successfully",
        });
    } catch {
        res.clearCookie("accessToken", COOKIE_OPTIONS_ACCESS);
        res.clearCookie("refreshToken", COOKIE_OPTIONS_REFRESH);

        res.status(httpStatus.UNAUTHORIZED).json({
            success: false,
            message: "Invalid refresh token, please login again",
        });
    }
};

export const AuthController = {
    register,
    login,
    logout,
    refreshToken,
};

import { Request, Response } from "express";
import httpStatus from "http-status";
import { AuthService } from "./auth.service";

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
        const result = await AuthService.login(req.body);
        res.status(httpStatus.OK).json({
            success: true,
            message: "Login successful",
            data: result,
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

export const AuthController = {
    register,
    login,
};

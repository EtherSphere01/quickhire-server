import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import config from "../../../config";
import { JwtPayload } from "../../middlewares/auth";

const prisma = new PrismaClient();

type RegisterPayload = {
    name: string;
    email: string;
    password: string;
};

type LoginPayload = {
    email: string;
    password: string;
};

const generateAccessToken = (payload: JwtPayload): string => {
    return jwt.sign(payload, config.jwt.secret, {
        expiresIn: config.jwt.expiresIn as jwt.SignOptions["expiresIn"],
    });
};

const generateRefreshToken = (payload: JwtPayload): string => {
    return jwt.sign(payload, config.jwt.refreshSecret, {
        expiresIn: config.jwt.refreshExpiresIn as jwt.SignOptions["expiresIn"],
    });
};

const register = async (data: RegisterPayload) => {
    const existing = await prisma.user.findUnique({
        where: { email: data.email },
    });

    if (existing) {
        throw new Error("Email already registered");
    }

    const hashedPassword = await bcrypt.hash(data.password, config.saltRounds);

    const user = await prisma.user.create({
        data: {
            name: data.name,
            email: data.email,
            password: hashedPassword,
        },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            created_at: true,
        },
    });

    return user;
};

const login = async (data: LoginPayload) => {
    const user = await prisma.user.findUnique({
        where: { email: data.email },
    });

    if (!user) {
        throw new Error("Invalid email or password");
    }

    const isPasswordValid = await bcrypt.compare(data.password, user.password);

    if (!isPasswordValid) {
        throw new Error("Invalid email or password");
    }

    const tokenPayload: JwtPayload = {
        id: user.id,
        email: user.email,
        role: user.role,
    };

    const accessToken = generateAccessToken(tokenPayload);
    const refreshToken = generateRefreshToken(tokenPayload);

    return {
        accessToken,
        refreshToken,
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
        },
    };
};

const refreshAccessToken = (refreshToken: string) => {
    const decoded = jwt.verify(
        refreshToken,
        config.jwt.refreshSecret,
    ) as JwtPayload;

    const tokenPayload: JwtPayload = {
        id: decoded.id,
        email: decoded.email,
        role: decoded.role,
    };

    return generateAccessToken(tokenPayload);
};

export const AuthService = {
    register,
    login,
    refreshAccessToken,
};

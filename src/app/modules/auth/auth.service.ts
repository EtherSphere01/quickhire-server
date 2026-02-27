import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import config from "../../../config";

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

    const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        config.jwt.secret,
        { expiresIn: config.jwt.expiresIn as jwt.SignOptions["expiresIn"] },
    );

    return {
        token,
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
        },
    };
};

export const AuthService = {
    register,
    login,
};

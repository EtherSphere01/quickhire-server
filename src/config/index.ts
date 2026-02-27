import dotenv from "dotenv";

dotenv.config();

const parsePort = (value: string | undefined): number => {
    if (!value) {
        return 5000;
    }

    const port = Number(value);
    if (!Number.isInteger(port) || port <= 0) {
        throw new Error(`Invalid PORT value: ${value}`);
    }

    return port;
};

export default {
    port: parsePort(process.env.PORT),
    jwt: {
        secret: process.env.JWT_SECRET || "fallback_secret",
        expiresIn: process.env.JWT_EXPIRES_IN || "7d",
    },
    saltRounds: Number(process.env.SALT_ROUNDS) || 12,
    cloudinary: {
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
    },
};

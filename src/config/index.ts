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
    env: process.env.NODE_ENV || "development",
    jwt: {
        secret: process.env.JWT_SECRET?.trim() || "fallback_secret",
        expiresIn: process.env.JWT_EXPIRES_IN?.trim() || "15m",
        refreshSecret:
            process.env.REFRESH_TOKEN_SECRET?.trim() ||
            "fallback_refresh_secret",
        refreshExpiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN?.trim() || "30d",
    },
    saltRounds: Number(process.env.SALT_ROUNDS) || 12,
    cloudinary: {
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME?.trim(),
        api_key: process.env.CLOUDINARY_API_KEY?.trim(),
        api_secret: process.env.CLOUDINARY_API_SECRET?.trim(),
    },
};

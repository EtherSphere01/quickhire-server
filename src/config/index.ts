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
};

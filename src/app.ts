import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import httpStatus from "http-status";
import router from "./app/routes";

const app = express();

app.use(
    cors({
        origin: process.env.CLIENT_URL?.trim() || true,
        credentials: true,
    }),
);
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req: Request, res: Response) => {
    res.send({
        Message: "QuickHire server is running successfully!",
    });
});

app.use("/api", router);

app.use((req: Request, res: Response, next: NextFunction) => {
    res.status(httpStatus.NOT_FOUND).json({
        success: false,
        message: "API NOT FOUND!",
        error: {
            path: req.originalUrl,
            message: "Your requested path is not found!",
        },
    });
});

app.use((err: any, req: Request, res: Response, _next: NextFunction) => {
    const statusCode = err.statusCode || httpStatus.INTERNAL_SERVER_ERROR;
    res.status(statusCode).json({
        success: false,
        message: err.message || "Something went wrong",
        error: process.env.NODE_ENV === "development" ? err : undefined,
    });
});

export default app;

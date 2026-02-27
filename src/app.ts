import express, { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import router from "./app/routes";

const app = express();

app.use(express.json());

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

export default app;

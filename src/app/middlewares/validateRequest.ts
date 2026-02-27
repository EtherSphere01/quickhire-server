import { NextFunction, Request, Response } from "express";
import { z } from "zod";

const validateRequest =
    (schema: z.ZodObject<any>) =>
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            await schema.parseAsync({
                body: req.body,
            });
            return next();
        } catch (error) {
            next(error);
        }
    };

export default validateRequest;

import { z } from "zod";

export const createApplicationSchema = z.object({
    body: z.object({
        job_id: z
            .union([z.string(), z.number()])
            .transform((v) => Number(v))
            .pipe(
                z.number().int().positive("Job ID must be a positive number"),
            ),
        name: z.string().min(3, "Name must be at least 3 characters"),
        email: z.string().email("Invalid email address"),
        resume_link: z.string().url("Resume link must be a valid URL"),
        cover_note: z
            .string()
            .min(10, "Cover note must be at least 10 characters"),
    }),
});

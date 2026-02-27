import z, { email } from "zod";

export const createApplicationSchema = z.object({
    job_id: z.number().positive("Job ID must be a positive number"),
    name: z.string().min(3, "Name is required"),
    email: z.string().email("Invalid email address"),
    resume_link: z.string().url("Invalid URL"),
    cover_node: z.string().min(10, "Cover note must be at least 10 characters"),
});

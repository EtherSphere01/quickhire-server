import { z } from "zod";

export const createJobSchema = z.object({
    body: z.object({
        title: z.string().min(3, "Title is required"),
        company: z.string().min(3, "Company is required"),
        location: z.string().min(3, "Location is required"),
        salary: z
            .union([z.string(), z.number()])
            .transform((v) => Number(v))
            .pipe(z.number().positive("Salary must be a positive number"))
            .optional(),
        description: z
            .string()
            .min(10, "Description must be at least 10 characters"),
        category: z.string().min(3, "Category is required"),
    }),
});

export const updateJobSchema = z.object({
    body: z.object({
        title: z.string().min(3, "Title is required").optional(),
        company: z.string().min(3, "Company is required").optional(),
        location: z.string().min(3, "Location is required").optional(),
        salary: z
            .union([z.string(), z.number()])
            .transform((v) => Number(v))
            .pipe(z.number().positive("Salary must be a positive number"))
            .optional(),
        description: z
            .string()
            .min(10, "Description must be at least 10 characters")
            .optional(),
        category: z.string().min(3, "Category is required").optional(),
    }),
});

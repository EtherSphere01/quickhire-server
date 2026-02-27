import { Prisma, PrismaClient } from "@prisma/client";
import {
    uploadToCloudinary,
    deleteFromCloudinary,
} from "../../utils/cloudinary";

const prisma = new PrismaClient();

type JobQueryParams = {
    search?: string;
    location?: string;
    category?: string;
};

type CreateJobPayload = {
    title: string;
    company: string;
    location: string;
    category: string;
    salary?: number;
    description: string;
    company_logo?: string;
};

type UpdateJobPayload = Partial<CreateJobPayload>;

const getAllJobs = async (query: JobQueryParams) => {
    const { search, location, category } = query;

    const where: Prisma.JobWhereInput = {
        isDeleted: false,
        title: search ? { contains: search, mode: "insensitive" } : undefined,
        location: location
            ? { contains: location, mode: "insensitive" }
            : undefined,
        category: category
            ? { contains: category, mode: "insensitive" }
            : undefined,
    };

    return prisma.job.findMany({
        where,
        orderBy: { created_at: "desc" },
    });
};

const getJobById = async (id: number) => {
    const job = await prisma.job.findFirst({
        where: { id, isDeleted: false },
        include: { applications: true },
    });

    if (!job) {
        throw new Error("Job not found");
    }

    return job;
};

const createJob = async (
    data: CreateJobPayload,
    file?: Express.Multer.File,
) => {
    if (file) {
        const uploaded = await uploadToCloudinary(file.buffer);
        data.company_logo = uploaded.secure_url;
    }

    return prisma.job.create({ data });
};

const updateJob = async (
    id: number,
    data: UpdateJobPayload,
    file?: Express.Multer.File,
) => {
    const existingJob = await getJobById(id);

    if (file) {
        if (existingJob.company_logo) {
            const publicId = existingJob.company_logo
                .split("/")
                .slice(-2)
                .join("/")
                .replace(/\.[^.]+$/, "");
            await deleteFromCloudinary(publicId);
        }

        const uploaded = await uploadToCloudinary(file.buffer);
        data.company_logo = uploaded.secure_url;
    }

    return prisma.job.update({
        where: { id },
        data,
    });
};

const deleteJob = async (id: number) => {
    await getJobById(id);

    return prisma.job.update({
        where: { id },
        data: { isDeleted: true },
    });
};

export const JobService = {
    getAllJobs,
    getJobById,
    createJob,
    updateJob,
    deleteJob,
};

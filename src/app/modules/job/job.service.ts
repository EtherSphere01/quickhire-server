import { Prisma, PrismaClient } from "@prisma/client";

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

const createJob = async (data: CreateJobPayload) => {
    return prisma.job.create({ data });
};

const updateJob = async (id: number, data: UpdateJobPayload) => {
    await getJobById(id);

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

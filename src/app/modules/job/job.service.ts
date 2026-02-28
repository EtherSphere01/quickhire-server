import { Prisma } from "@prisma/client";
import {
    uploadToCloudinary,
    deleteFromCloudinary,
} from "../../utils/cloudinary";
import { prisma } from "../../utils/prisma";
import {
    CreateJobPayload,
    JobQueryParams,
    UpdateJobPayload,
} from "./job.types";

const getAllJobs = async (query: JobQueryParams) => {
    const { search, location, category } = query;
    const page = Math.max(1, parseInt(query.page || "1", 10) || 1);
    const limit = Math.min(
        50,
        Math.max(1, parseInt(query.limit || "10", 10) || 10),
    );
    const skip = (page - 1) * limit;

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

    const [jobs, total] = await Promise.all([
        prisma.job.findMany({
            where,
            orderBy: { created_at: "desc" },
            skip,
            take: limit,
        }),
        prisma.job.count({ where }),
    ]);

    return {
        jobs,
        meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
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

const getDashboardStats = async () => {
    const [jobs, totalApplications, recentApplications, topAppliedRaw] =
        await Promise.all([
            prisma.job.findMany({
                where: { isDeleted: false },
                select: {
                    id: true,
                    title: true,
                    company: true,
                    company_logo: true,
                    job_type: true,
                    category: true,
                    location: true,
                    created_at: true,
                },
                orderBy: { created_at: "desc" },
            }),
            prisma.application.count(),
            prisma.application.findMany({
                orderBy: { created_at: "desc" },
                take: 10,
                include: {
                    job: {
                        select: { title: true, company: true },
                    },
                },
            }),
            prisma.application.groupBy({
                by: ["job_id"],
                _count: { id: true },
                orderBy: { _count: { id: "desc" } },
                take: 1,
            }),
        ]);

    const jobsByType: Record<string, number> = {};
    const jobsByCategory: Record<string, number> = {};
    const jobsByCompany: Record<string, number> = {};

    for (const job of jobs) {
        jobsByType[job.job_type] = (jobsByType[job.job_type] || 0) + 1;
        jobsByCategory[job.category] = (jobsByCategory[job.category] || 0) + 1;
        jobsByCompany[job.company] = (jobsByCompany[job.company] || 0) + 1;
    }

    let topAppliedJob = null;
    if (topAppliedRaw.length > 0) {
        const topJob = await prisma.job.findUnique({
            where: { id: topAppliedRaw[0].job_id },
            select: {
                id: true,
                title: true,
                company: true,
                company_logo: true,
            },
        });
        if (topJob) {
            topAppliedJob = {
                ...topJob,
                applicationCount: topAppliedRaw[0]._count.id,
            };
        }
    }

    return {
        totalJobs: jobs.length,
        totalApplications,
        jobsByType,
        jobsByCategory,
        jobsByCompany,
        topAppliedJob,
        recentApplications,
        recentJobs: jobs.slice(0, 5),
    };
};

export const JobService = {
    getAllJobs,
    getJobById,
    createJob,
    updateJob,
    deleteJob,
    getDashboardStats,
};

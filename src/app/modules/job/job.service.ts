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

let statsCache: { data: any; timestamp: number } | null = null;
const STATS_CACHE_TTL = 30_000;

const getDashboardStats = async () => {
    if (statsCache && Date.now() - statsCache.timestamp < STATS_CACHE_TTL) {
        return statsCache.data;
    }

    const [
        totalJobs,
        totalApplications,
        typeGroups,
        categoryGroups,
        companyGroups,
        topAppliedRaw,
        recentApplications,
        recentJobs,
    ] = await Promise.all([
        prisma.job.count({ where: { isDeleted: false } }),
        prisma.application.count(),
        prisma.job.groupBy({
            by: ["job_type"],
            where: { isDeleted: false },
            _count: { id: true },
        }),
        prisma.job.groupBy({
            by: ["category"],
            where: { isDeleted: false },
            _count: { id: true },
        }),
        prisma.job.groupBy({
            by: ["company"],
            where: { isDeleted: false },
            _count: { id: true },
        }),
        prisma.application.groupBy({
            by: ["job_id"],
            _count: { id: true },
            orderBy: { _count: { id: "desc" } },
            take: 1,
        }),
        prisma.application.findMany({
            orderBy: { created_at: "desc" },
            take: 10,
            include: {
                job: { select: { title: true, company: true } },
            },
        }),
        prisma.job.findMany({
            where: { isDeleted: false },
            orderBy: { created_at: "desc" },
            take: 5,
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
        }),
    ]);

    const jobsByType: Record<string, number> = {};
    for (const g of typeGroups) jobsByType[g.job_type] = g._count.id;

    const jobsByCategory: Record<string, number> = {};
    for (const g of categoryGroups) jobsByCategory[g.category] = g._count.id;

    const jobsByCompany: Record<string, number> = {};
    for (const g of companyGroups) jobsByCompany[g.company] = g._count.id;

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

    const result = {
        totalJobs,
        totalApplications,
        jobsByType,
        jobsByCategory,
        jobsByCompany,
        topAppliedJob,
        recentApplications,
        recentJobs,
    };

    statsCache = { data: result, timestamp: Date.now() };
    return result;
};

const invalidateStatsCache = () => {
    statsCache = null;
};

export const JobService = {
    getAllJobs,
    getJobById,
    createJob,
    updateJob,
    deleteJob,
    getDashboardStats,
    invalidateStatsCache,
};

import { prisma } from "../../utils/prisma";
import { CreateApplicationPayload } from "./application.types";

const createApplication = async (data: CreateApplicationPayload) => {
    const job = await prisma.job.findFirst({
        where: { id: data.job_id, isDeleted: false },
    });

    if (!job) {
        throw new Error("Job not found");
    }

    return prisma.application.create({ data });
};

const getApplicationsByJobId = async (jobId: number) => {
    return prisma.application.findMany({
        where: { job_id: jobId },
        orderBy: { created_at: "desc" },
    });
};

const getAllApplications = async (query: {
    page?: string;
    limit?: string;
}) => {
    const page = Math.max(1, parseInt(query.page || "1", 10) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(query.limit || "10", 10) || 10));
    const skip = (page - 1) * limit;

    const [applications, total] = await Promise.all([
        prisma.application.findMany({
            orderBy: { created_at: "desc" },
            skip,
            take: limit,
            include: {
                job: {
                    select: { title: true, company: true },
                },
            },
        }),
        prisma.application.count(),
    ]);

    return {
        applications,
        meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
};

export const ApplicationService = {
    createApplication,
    getApplicationsByJobId,
    getAllApplications,
};

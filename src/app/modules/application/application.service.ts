import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

type CreateApplicationPayload = {
    job_id: number;
    name: string;
    email: string;
    resume_link: string;
    cover_note: string;
};

const createApplication = async (data: CreateApplicationPayload) => {
    // Verify the job exists and is not deleted
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

export const ApplicationService = {
    createApplication,
    getApplicationsByJobId,
};

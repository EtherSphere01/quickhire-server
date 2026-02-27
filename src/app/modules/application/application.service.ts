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

export const ApplicationService = {
    createApplication,
    getApplicationsByJobId,
};

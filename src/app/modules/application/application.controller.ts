import { Request, Response } from "express";
import httpStatus from "http-status";
import { ApplicationService } from "./application.service";

const createApplication = async (req: Request, res: Response) => {
    try {
        const application = await ApplicationService.createApplication(req.body);
        res.status(httpStatus.CREATED).json({
            success: true,
            message: "Application submitted successfully",
            data: application,
        });
    } catch (error: any) {
        const status =
            error.message === "Job not found"
                ? httpStatus.NOT_FOUND
                : httpStatus.INTERNAL_SERVER_ERROR;
        res.status(status).json({
            success: false,
            message: error.message || "Failed to submit application",
        });
    }
};

const getApplicationsByJobId = async (req: Request, res: Response) => {
    try {
        const jobId = Number(req.params.jobId);
        const applications =
            await ApplicationService.getApplicationsByJobId(jobId);
        res.status(httpStatus.OK).json({
            success: true,
            message: "Applications retrieved successfully",
            data: applications,
        });
    } catch (error: any) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: error.message || "Failed to retrieve applications",
        });
    }
};

export const ApplicationController = {
    createApplication,
    getApplicationsByJobId,
};

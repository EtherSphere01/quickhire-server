import { Request, Response } from "express";
import httpStatus from "http-status";
import { JobService } from "./job.service";

const getAllJobs = async (req: Request, res: Response) => {
    try {
        const jobs = await JobService.getAllJobs(req.query);
        res.status(httpStatus.OK).json({
            success: true,
            message: "Jobs retrieved successfully",
            data: jobs,
        });
    } catch (error: any) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: error.message || "Failed to retrieve jobs",
        });
    }
};

const getJobById = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);
        const job = await JobService.getJobById(id);
        res.status(httpStatus.OK).json({
            success: true,
            message: "Job retrieved successfully",
            data: job,
        });
    } catch (error: any) {
        const status =
            error.message === "Job not found"
                ? httpStatus.NOT_FOUND
                : httpStatus.INTERNAL_SERVER_ERROR;
        res.status(status).json({
            success: false,
            message: error.message || "Failed to retrieve job",
        });
    }
};

const createJob = async (req: Request, res: Response) => {
    try {
        const body = req.body;
        if (body.salary) body.salary = Number(body.salary);
        const job = await JobService.createJob(body, req.file);
        res.status(httpStatus.CREATED).json({
            success: true,
            message: "Job created successfully",
            data: job,
        });
    } catch (error: any) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: error.message || "Failed to create job",
        });
    }
};

const updateJob = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);
        const body = req.body;
        if (body.salary) body.salary = Number(body.salary);
        const job = await JobService.updateJob(id, body, req.file);
        res.status(httpStatus.OK).json({
            success: true,
            message: "Job updated successfully",
            data: job,
        });
    } catch (error: any) {
        const status =
            error.message === "Job not found"
                ? httpStatus.NOT_FOUND
                : httpStatus.INTERNAL_SERVER_ERROR;
        res.status(status).json({
            success: false,
            message: error.message || "Failed to update job",
        });
    }
};

const deleteJob = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);
        await JobService.deleteJob(id);
        res.status(httpStatus.OK).json({
            success: true,
            message: "Job deleted successfully",
        });
    } catch (error: any) {
        const status =
            error.message === "Job not found"
                ? httpStatus.NOT_FOUND
                : httpStatus.INTERNAL_SERVER_ERROR;
        res.status(status).json({
            success: false,
            message: error.message || "Failed to delete job",
        });
    }
};

const getDashboardStats = async (req: Request, res: Response) => {
    try {
        const stats = await JobService.getDashboardStats();
        res.status(httpStatus.OK).json({
            success: true,
            message: "Dashboard stats retrieved successfully",
            data: stats,
        });
    } catch (error: any) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: error.message || "Failed to retrieve stats",
        });
    }
};

export const JobController = {
    getAllJobs,
    getJobById,
    createJob,
    updateJob,
    deleteJob,
    getDashboardStats,
};

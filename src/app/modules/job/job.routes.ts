import express from "express";
import { JobController } from "./job.controller";
import validateRequest from "../../middlewares/validateRequest";
import { createJobSchema, updateJobSchema } from "./job.validator";
import upload from "../../middlewares/upload";
import auth from "../../middlewares/auth";

const router = express.Router();

router.get("/stats", auth("ADMIN"), JobController.getDashboardStats);
router.get("/", JobController.getAllJobs);
router.get("/:id", JobController.getJobById);

router.post(
    "/",
    auth("ADMIN"),
    upload.single("company_logo"),
    validateRequest(createJobSchema),
    JobController.createJob,
);
router.patch(
    "/:id",
    auth("ADMIN"),
    upload.single("company_logo"),
    validateRequest(updateJobSchema),
    JobController.updateJob,
);
router.delete("/:id", auth("ADMIN"), JobController.deleteJob);

export default router;

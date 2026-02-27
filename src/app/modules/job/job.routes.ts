import express from "express";
import { JobController } from "./job.controller";
import validateRequest from "../../middlewares/validateRequest";
import { createJobSchema, updateJobSchema } from "./job.validator";
import upload from "../../middlewares/upload";

const router = express.Router();

router.get("/", JobController.getAllJobs);
router.get("/:id", JobController.getJobById);
router.post(
    "/",
    upload.single("company_logo"),
    validateRequest(createJobSchema),
    JobController.createJob,
);
router.patch(
    "/:id",
    upload.single("company_logo"),
    validateRequest(updateJobSchema),
    JobController.updateJob,
);
router.delete("/:id", JobController.deleteJob);

export default router;

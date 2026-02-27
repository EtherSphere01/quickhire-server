import express from "express";
import { JobController } from "./job.controller";
import validateRequest from "../../middlewares/validateRequest";
import { createJobSchema, updateJobSchema } from "./job.validator";

const router = express.Router();

router.get("/", JobController.getAllJobs);
router.get("/:id", JobController.getJobById);
router.post("/", validateRequest(createJobSchema), JobController.createJob);
router.patch("/:id", validateRequest(updateJobSchema), JobController.updateJob);
router.delete("/:id", JobController.deleteJob);

export default router;

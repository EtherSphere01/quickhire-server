import express from "express";
import { ApplicationController } from "./application.controller";
import validateRequest from "../../middlewares/validateRequest";
import { createApplicationSchema } from "./application.validator";
import auth from "../../middlewares/auth";

const router = express.Router();

// Public — anyone can apply without login
router.post(
    "/",
    validateRequest(createApplicationSchema),
    ApplicationController.createApplication,
);

// Admin-only — view applications for a job
router.get(
    "/job/:jobId",
    auth("ADMIN"),
    ApplicationController.getApplicationsByJobId,
);

export default router;

import express from "express";
import { ApplicationController } from "./application.controller";
import validateRequest from "../../middlewares/validateRequest";
import { createApplicationSchema } from "./application.validator";
import auth from "../../middlewares/auth";

const router = express.Router();

router.post(
    "/",
    validateRequest(createApplicationSchema),
    ApplicationController.createApplication,
);

router.get(
    "/job/:jobId",
    auth("ADMIN"),
    ApplicationController.getApplicationsByJobId,
);

export default router;

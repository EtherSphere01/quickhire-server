import express from "express";
import jobRoutes from "../modules/job/job.routes";

const router = express.Router();

const moduleRoutes = [
    {
        path: "/jobs",
        route: jobRoutes,
    },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));
export default router;

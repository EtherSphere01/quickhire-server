import express from "express";
import authRoutes from "../modules/auth/auth.routes";
import jobRoutes from "../modules/job/job.routes";
import applicationRoutes from "../modules/application/application.routes";

const router = express.Router();

const moduleRoutes = [
    {
        path: "/auth",
        route: authRoutes,
    },
    {
        path: "/jobs",
        route: jobRoutes,
    },
    {
        path: "/applications",
        route: applicationRoutes,
    },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));
export default router;

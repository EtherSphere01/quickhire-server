import express from "express";
import { AuthController } from "./auth.controller";
import validateRequest from "../../middlewares/validateRequest";
import { registerSchema, loginSchema } from "./auth.validator";

const router = express.Router();

router.post(
    "/register",
    validateRequest(registerSchema),
    AuthController.register,
);
router.post("/login", validateRequest(loginSchema), AuthController.login);
router.post("/logout", AuthController.logout);
router.post("/refresh-token", AuthController.refreshToken);

export default router;

import express from "express";
import * as authController from "../controllers/auth.js";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();

router.post("/register", authController.register);
router.post("/verify-otp", authController.verifyOTP);
router.post("/login", authController.login);
router.post("/resend-otp", authController.reenviarOTP);
router.get("/me", authMiddleware, authController.getMe);

export default router;
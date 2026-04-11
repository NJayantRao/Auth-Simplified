import express from "express";
import {
  loginUser,
  logoutUser,
  refreshAccessToken,
  registerUser,
  verifyEmail,
} from "../controllers/auth.controller.js";
import { validateData } from "../middlewares/zod-validation.js";
import { loginSchema, registerSchema } from "../validators/auth-schema.js";
import { authMiddleware } from "../middlewares/auth-middleware.js";

const router = express.Router();

router.post("/register", validateData(registerSchema), registerUser);
router.post("/login", validateData(loginSchema), loginUser);
router.post("/logout", authMiddleware, logoutUser);
router.get("/verify-email", verifyEmail);
router.post("/refresh-token", authMiddleware, refreshAccessToken);

export { router as authRouter };

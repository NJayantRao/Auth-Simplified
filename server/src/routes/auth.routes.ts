import express from "express";
import {
  refreshAccessToken,
  registerUser,
  verifyEmail,
  verifyUserEmail,
} from "../controllers/auth.controller.js";
import { validateData } from "../middlewares/zod-validation.js";
import { registerSchema } from "../validators/register-schema.js";
import { authMiddleware } from "../middlewares/auth-middleware.js";

const router = express.Router();

router.post("/users/", validateData(registerSchema), registerUser);
router.get("/verify-email", verifyEmail);
router.post("/users/verify-email", authMiddleware, verifyUserEmail);
router.post("/refresh-token", authMiddleware, refreshAccessToken);

export { router as authRouter };

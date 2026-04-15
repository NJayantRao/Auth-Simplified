import express from "express";

import { authMiddleware } from "../middlewares/auth-middleware.js";
import {
  getUserProfile,
  verifyUserEmail,
} from "../controllers/user.controller.js";

const router = express.Router();

router.post("/verify-email", authMiddleware, verifyUserEmail);
router.get("/profile", authMiddleware, getUserProfile);

export { router as userRouter };

import express from "express";

import { authMiddleware } from "../middlewares/auth-middleware.js";
import { verifyUserEmail } from "../controllers/user.controller.js";

const router = express.Router();

router.post("/verify-email", authMiddleware, verifyUserEmail);

export { router as userRouter };

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
import {
  getGithubLoginCallback,
  getGoogleLoginCallback,
  githubLogin,
  googleLogin,
} from "../controllers/oauth.controller.js";

const router = express.Router();

router.post("/register", validateData(registerSchema), registerUser);
router.post("/login", validateData(loginSchema), loginUser);
router.post("/logout", authMiddleware, logoutUser);
router.get("/verify-email", verifyEmail);
router.post("/refresh-token", refreshAccessToken);
router.get("/google", googleLogin);
router.get("/google/callback", getGoogleLoginCallback);
router.get("/github", githubLogin);
router.get("/github/callback", getGithubLoginCallback);

export { router as authRouter };

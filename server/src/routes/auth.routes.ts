import express from "express";
import { registerUser } from "../controllers/auth.controller.js";
import { validateData } from "../middlewares/zod-validation.js";
import { registerSchema } from "../validators/register-schema.js";

const router = express.Router();

router.post("/", validateData(registerSchema), registerUser);

export { router as authRouter };

import { prisma } from "../lib/prisma.js";
import ApiError from "../utils/api-error.js";
import ApiResponse from "../utils/api-response.js";
import AsyncHandler from "../utils/async-handler.js";

export const registerUser = AsyncHandler(async (req: any, res: any) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json(new ApiError(400,"All fields are required"));
  }

  const existingUser = await prisma.user.findUnique({ where: { email } });

  if (existingUser) {
    return res.status(400).json(new ApiError(400,"User already exists"));
  }

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password,
    },
  });
  return res.status(201).json(new  ApiResponse(201, "User registered successfully"))
});

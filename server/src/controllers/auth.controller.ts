import { hashPassword } from "../lib/bcrypt.js";
import { prisma } from "../lib/prisma.js";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../middlewares/auth-middleware.js";
import type { Ipayload } from "../types/jwt.types.js";
import ApiError from "../utils/api-error.js";
import ApiResponse from "../utils/api-response.js";
import AsyncHandler from "../utils/async-handler.js";
import { sendRegistrationMail } from "../utils/send-mails.js";

/**
 * @route POST /api/v1/auth/register
 * @description controller to register a new user
 * @access public
 */
export const registerUser = AsyncHandler(async (req: any, res: any) => {
  // get data from request body
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json(new ApiError(400, "All fields are required"));
  }

  // check if user already exists
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    return res.status(400).json(new ApiError(400, "User already exists"));
  }

  //hash password
  const hashedPassword = await hashPassword(password);

  //create user in db
  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  });

  //jwt payload
  const payload: Ipayload = {
    id: user.id,
    email: user.email,
    role: user.role,
  };

  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);

  res.cookie("accessToken", accessToken);
  res.cookie("refreshToken", refreshToken);
  sendRegistrationMail(name, email, "random");
  return res.status(201).json(
    new ApiResponse(201, "User registered successfully", {
      accessToken,
      refreshToken,
    })
  );
});

import { prisma } from "../lib/prisma.js";
import { redisClient } from "../lib/redis.js";
import AsyncHandler from "../utils/async-handler.js";
import crypto from "crypto";
import { sendVerificationMail } from "../utils/send-mails.js";
import ApiResponse from "../utils/api-response.js";
import { comparePassword, hashPassword } from "../lib/bcrypt.js";
import ApiError from "../utils/api-error.js";

/**
 * @route POST /api/v1/users/verify-email
 * @description controller to Verify users email
 * @access private
 */
const verifyUserEmail = AsyncHandler(async (req: any, res: any) => {
  const { id } = req.user;
  const user = await prisma.user.findUnique({ where: { id } });
  //generate verification link
  const verificationToken = crypto.randomBytes(32).toString("hex");
  await redisClient.set(
    `verify-token:${user?.id}`,
    verificationToken,
    "EX",
    10 * 60
  );
  const verifyLink = `${req.protocol}://${req.get("host")}/api/v1/auth/verify-email?id=${user?.id!}&verifyToken=${verificationToken}`;
  // console.log(verifyLink);

  sendVerificationMail(user?.name!, user?.email!, verifyLink);

  return res.status(200).json(new ApiResponse(200, "Verification email sent"));
});

/**
 * @route POST /api/v1/users/profile
 * @description controller to get user profile
 * @access private
 */
const getUserProfile = AsyncHandler(async (req: any, res: any) => {
  const { id } = req.user;

  const cachedUser = await redisClient.get(`cached-user:${id}`);
  if (cachedUser) {
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          "User fetched successfully",
          JSON.parse(cachedUser)
        )
      );
  }

  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      email: true,
      role: true,
      isVerified: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!user) {
    return res.status(401).json(new ApiResponse(401, "Invalid Credentials"));
  }

  await redisClient.set(
    `cached-user:${user.id}`,
    JSON.stringify(user),
    "EX",
    60
  );

  return res
    .status(200)
    .json(new ApiResponse(200, "User fetched successfully", user));
});

/**
 * @route POST /api/v1/users/change-password
 * @description controller tochange user password
 * @access private
 */
const changePassword = AsyncHandler(async (req: any, res: any) => {
  const { oldPassword, newPassword } = req.body;
  const { id } = req.user;

  if (!oldPassword || !newPassword) {
    return res.status(400).json(new ApiError(400, "All fields are required"));
  }

  if (oldPassword === newPassword) {
    return res
      .status(400)
      .json(
        new ApiError(400, "New password must be different from old password")
      );
  }

  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      email: true,
      password: true,
    },
  });

  if (!user) {
    return res.status(401).json(new ApiError(401, "Invalid Credentials"));
  }
  if (!user.password) {
    return res
      .status(400)
      .json(
        new ApiError(
          400,
          "User registered via OAuth, password change not allowed"
        )
      );
  }

  const isMatched = await comparePassword(oldPassword, user.password);

  if (!isMatched) {
    return res.status(400).json(new ApiError(400, "Password is incorrect"));
  }

  //hash password
  const hashedPassword = await hashPassword(newPassword);

  await prisma.user.update({
    where: { id },
    data: { password: hashedPassword },
  });

  return res
    .status(200)
    .json(new ApiResponse(200, "Password Changed successfully"));
});

export { verifyUserEmail, getUserProfile, changePassword };

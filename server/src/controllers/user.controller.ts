import { prisma } from "../lib/prisma.js";
import { redisClient } from "../lib/redis.js";
import AsyncHandler from "../utils/async-handler.js";
import crypto from "crypto";
import { sendVerificationMail } from "../utils/send-mails.js";
import ApiResponse from "../utils/api-response.js";

/**
 * @route POST /api/v1/users/verify-email
 * @description controller to Verify users email
 * @access private
 */
export const verifyUserEmail = AsyncHandler(async (req: any, res: any) => {
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
export const getUserProfile = AsyncHandler(async (req: any, res: any) => {
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

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

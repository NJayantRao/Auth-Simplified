import mongoose from "mongoose";
import { comparePassword } from "../lib/bcrypt.js";
import { ENV } from "../lib/env.js";
import { redisClient } from "../lib/redis.js";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../middlewares/auth-middleware.js";
import type { IPayload } from "../types/jwt.types.js";
import ApiError from "../utils/api-error.js";
import ApiResponse from "../utils/api-response.js";
import AsyncHandler from "../utils/async-handler.js";
import { accessTokenOptions, refreshTokenOptions } from "../utils/constants.js";
import { sendOtpMail, sendRegistrationMail } from "../utils/send-mails.js";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import { OAuthProvider } from "../models/oAuth.model.js";
import { User } from "../models/user.model.js";

/**
 * @route POST /api/v1/auth/register
 * @description controller to register a new user
 * @access public
 */
const registerUser = AsyncHandler(async (req: any, res: any) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json(new ApiError(400, "All fields are required"));
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json(new ApiError(400, "User already exists"));
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const createdUser = await new User({
      name,
      email,
      password,
    }).save({ session });

    await new OAuthProvider({
      userId: createdUser._id,
      providerName: "LOCAL",
      providerUserId: createdUser.id,
    }).save({ session });

    await session.commitTransaction();
    session.endSession();

    const sessionId = crypto.randomBytes(16).toString("hex");
    const payload: IPayload = {
      id: createdUser.id,
      email: createdUser.email,
      role: createdUser.role,
      sessionId,
    };

    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    await redisClient.set(
      `refresh-token:${createdUser.id}`,
      refreshToken,
      "EX",
      7 * 24 * 60 * 60
    );

    await redisClient.set(
      `active-session:${createdUser.id}`,
      sessionId,
      "EX",
      7 * 24 * 60 * 60
    );

    const verificationToken = crypto.randomBytes(32).toString("hex");
    await redisClient.set(
      `verify-token:${createdUser.id}`,
      verificationToken,
      "EX",
      10 * 60
    );
    const verifyLink = `${req.protocol}://${req.get("host")}/api/v1/auth/verify-email?id=${createdUser.id}&verifyToken=${verificationToken}`;

    res.cookie("accessToken", accessToken, accessTokenOptions);
    res.cookie("refreshToken", refreshToken, refreshTokenOptions);
    sendRegistrationMail(name, email, verifyLink);

    return res.status(201).json(
      new ApiResponse(201, "User registered successfully", {
        accessToken,
        refreshToken,
        user: {
          id: createdUser.id,
          email: createdUser.email,
          role: createdUser.role,
          isVerified: createdUser.isVerified,
          createdAt: createdUser.createdAt,
          updatedAt: createdUser.updatedAt,
        },
      })
    );
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
});
/**
 * @route POST /api/v1/auth/login
 * @description controller to login a user
 * @access public
 */
const loginUser = AsyncHandler(async (req: any, res: any) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json(new ApiError(400, "All fields are required"));
  }

  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return res.status(401).json(new ApiError(401, "Invalid Credentials"));
  }
  if (!user.password) {
    return res
      .status(400)
      .json(new ApiError(400, "Please login with your OAuth provider"));
  }

  const isMatched = await comparePassword(password, user.password);
  if (!isMatched) {
    return res.status(401).json(new ApiError(401, "Invalid Credentials"));
  }

  const sessionId = crypto.randomBytes(16).toString("hex");
  const payload: IPayload = {
    id: user.id,
    email: user.email,
    role: user.role,
    sessionId,
  };
  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);

  const sanitizedUser = {
    id: user.id,
    email: user.email,
    role: user.role,
    isVerified: user.isVerified,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };

  await redisClient.set(
    `refresh-token:${user.id}`,
    refreshToken,
    "EX",
    7 * 24 * 60 * 60
  );
  await redisClient.set(
    `active-session:${user.id}`,
    sessionId,
    "EX",
    7 * 24 * 60 * 60
  );
  res.cookie("accessToken", accessToken, accessTokenOptions);
  res.cookie("refreshToken", refreshToken, refreshTokenOptions);

  return res.status(200).json(
    new ApiResponse(200, "Logged in successfully", {
      accessToken,
      refreshToken,
      user: sanitizedUser,
    })
  );
});

/**
 * @route POST /api/v1/auth/logout
 * @description controller to login a user
 * @access private
 */
const logoutUser = AsyncHandler(async (req: any, res: any) => {
  const { id } = req.user;

  const refreshToken = req?.cookies?.refreshToken;
  const storedRefreshToken = await redisClient.get(`refresh-token:${id}`);
  if (!refreshToken || refreshToken !== storedRefreshToken) {
    return res.status(401).json(new ApiError(401, "Unauthorized request"));
  }

  //black list refresh token
  await redisClient.set(
    `blackList-token:${refreshToken}`,
    "BLOCKED",
    "EX",
    7 * 24 * 60 * 60
  );
  await redisClient.del(`refresh-token:${id}`);
  await redisClient.del(`active-session:${id}`);

  //clear tokens from cookies
  res.clearCookie("accessToken", accessTokenOptions);
  res.clearCookie("refreshToken", refreshTokenOptions);

  return res.status(200).json(new ApiResponse(200, "Logged out successfully"));
});

/**
 * @route POST /api/v1/auth/verify-email
 * @description controller to Verify email
 * @access public
 */
const verifyEmail = AsyncHandler(async (req: any, res: any) => {
  const { id, verifyToken } = req.query;

  const storedVerifyToken = await redisClient.get(`verify-token:${id}`);

  if (verifyToken !== storedVerifyToken) {
    return res.status(400).json(new ApiError(400, "Email verification failed"));
  }

  const user = await User.findByIdAndUpdate(
    id,
    { isVerified: true },
    { new: true }
  );

  if (!user) {
    return res.status(404).json(new ApiError(404, "User not found"));
  }

  await redisClient.del(`verify-token:${user.id}`);

  return res.redirect(`${ENV.FRONTEND_URL}/dashboard`);
});

/**
 * @route POST /api/v1/auth/forgot-password
 * @description controller to forgot password
 * @access public
 */
const forgotPassword = AsyncHandler(async (req: any, res: any) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json(new ApiError(400, "All fields are required"));
  }

  const isExistingUser = await User.findOne({ email });

  if (!isExistingUser) {
    return res
      .status(200)
      .json(
        new ApiResponse(200, "If the email is registered, an OTP has been sent")
      );
  }

  const otp = crypto.randomInt(100000, 1000000);

  await redisClient.set(`verify-otp:${email}`, otp.toString(), "EX", 10 * 60);
  sendOtpMail(email, otp.toString());

  return res
    .status(200)
    .json(
      new ApiResponse(200, "If the email is registered, an OTP has been sent")
    );
});

/**
 * @route POST /api/v1/auth/reset-password
 * @description controller to reset password
 * @access public
 */
const resetPassword = AsyncHandler(async (req: any, res: any) => {
  const { email, otp, newPassword } = req.body;

  if (!email || !otp || !newPassword) {
    return res.status(400).json(new ApiError(400, "All fields are required"));
  }

  const user = await User.findOne({ email }).select("+password");
  const storedOtp = await redisClient.get(`verify-otp:${email}`);

  if (!user || !storedOtp || otp !== storedOtp) {
    await redisClient.del(`verify-otp:${email}`);
    return res.status(400).json(new ApiError(400, "Invalid email or OTP"));
  }

  user.password = newPassword;
  await user.save();

  await redisClient.del(`verify-otp:${email}`);

  return res
    .status(200)
    .json(new ApiResponse(200, "Password reset successfully."));
});

/**
 * @route POST /auth/refresh-token
 * @desc Refresh access token controller
 * @access public
 */
const refreshAccessToken = async (req: any, res: any) => {
  try {
    const authorization = req?.headers?.authorization;
    const refreshToken =
      req?.cookies?.refreshToken || authorization?.split(" ")[1];

    if (!refreshToken) {
      return res.status(401).json(new ApiError(401, "Unauthorized request"));
    }
    const blacklisted = await redisClient.get(
      `blackList-token:${refreshToken}`
    );
    if (blacklisted === "BLOCKED") {
      return res.status(401).json(new ApiError(401, "Unauthorized request"));
    }
    const decoded = jwt.verify(
      refreshToken,
      ENV.REFRESH_TOKEN_SECRET
    ) as IPayload;
    const { id, email, role, sessionId } = decoded;

    const storedRefreshToken = await redisClient.get(`refresh-token:${id}`);

    if (!storedRefreshToken || storedRefreshToken !== refreshToken) {
      return res
        .status(401)
        .json(new ApiError(401, "Session expired. Please login again."));
    }

    const activeSessionId = await redisClient.get(`active-session:${id}`);
    if (!activeSessionId || activeSessionId !== sessionId) {
      return res
        .status(401)
        .json(
          new ApiError(
            401,
            "Session expired. You logged in from another device."
          )
        );
    }

    const accessToken = jwt.sign(
      { id, email, role, sessionId },
      ENV.ACCESS_TOKEN_SECRET,
      {
        expiresIn: "15m",
      }
    );

    res.cookie("accessToken", accessToken, accessTokenOptions);
    // console.log("refresh token called");

    return res.status(200).json(
      new ApiResponse(200, "Access token refreshed successfully", {
        accessToken,
      })
    );
  } catch (error: any) {
    console.error(error);

    if (error.name === "TokenExpiredError") {
      return res
        .status(401)
        .json(new ApiError(401, "Session expired, Please login again"));
    }
    return res.status(401).json(new ApiError(401, "Unauthorized request"));
  }
};

export {
  registerUser,
  loginUser,
  logoutUser,
  verifyEmail,
  forgotPassword,
  resetPassword,
  refreshAccessToken,
};

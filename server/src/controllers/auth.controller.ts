import { use } from "react";
import { comparePassword, hashPassword } from "../lib/bcrypt.js";
import { ENV } from "../lib/env.js";
import { prisma } from "../lib/prisma.js";
import { redisClient } from "../lib/redis.js";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../middlewares/auth-middleware.js";
import type { IPayload } from "../types/jwt.types.js";
import ApiError from "../utils/api-error.js";
import ApiResponse from "../utils/api-response.js";
import AsyncHandler from "../utils/async-handler.js";
import { baseOptions, refreshTokenOptions } from "../utils/constants.js";
import { sendRegistrationMail } from "../utils/send-mails.js";
import crypto from "crypto";
import jwt from "jsonwebtoken";

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
  const payload: IPayload = {
    id: user.id,
    email: user.email,
    role: user.role,
  };

  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);

  //store refresh token in redis
  await redisClient.set(
    `refresh-token:${user.id}`,
    refreshToken,
    "EX",
    7 * 24 * 60 * 60
  );

  //generate verification link
  const verificationToken = crypto.randomBytes(32).toString("hex");
  await redisClient.set(
    `verify-token:${user.id}`,
    verificationToken,
    "EX",
    10 * 60
  );
  const verifyLink = `${req.protocol}://${req.get("host")}/api/v1/auth/verify-email?id=${user.id}&verifyToken=${verificationToken}`;
  // console.log(verifyLink);

  res.cookie("accessToken", accessToken, baseOptions);
  res.cookie("refreshToken", refreshToken, refreshTokenOptions);
  sendRegistrationMail(name, email, verifyLink);
  return res.status(201).json(
    new ApiResponse(201, "User registered successfully", {
      accessToken,
      refreshToken,
    })
  );
});

/**
 * @route POST /api/v1/auth/login
 * @description controller to login a user
 * @access public
 */
export const loginUser = AsyncHandler(async (req: any, res: any) => {
  // get data from request body
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json(new ApiError(400, "All fields are required"));
  }

  //check user exists or not
  const user = await prisma.user.findUnique({
    where: { email },
    select: { id: true, email: true, password: true, role: true },
  });
  if (!user) {
    return res.status(404).json(new ApiError(401, "Invalid Credentials"));
  }

  //compare password
  const isMatched = await comparePassword(password, user.password);
  if (!isMatched) {
    return res.status(404).json(new ApiError(401, "Invalid Credentials"));
  }

  //generate access & refresh tokens
  const payload: IPayload = {
    id: user.id,
    email: user.email,
    role: user.role,
  };
  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);

  //set refresh token in redis
  await redisClient.set(
    `refresh-token:${user.id}`,
    refreshToken,
    "EX",
    7 * 24 * 60 * 60
  );
  //set cookies
  res.cookie("accessToken", accessToken, baseOptions);
  res.cookie("refreshToken", refreshToken, refreshTokenOptions);

  return res.status(200).json(
    new ApiResponse(200, "Logged in successfully", {
      accessToken,
      refreshToken,
    })
  );
});

/**
 * @route POST /api/v1/auth/logout
 * @description controller to login a user
 * @access public
 */
export const logoutUser = AsyncHandler(async (req: any, res: any) => {
  const userId = req.user.id;

  const refreshToken = req?.cookies?.refreshToken;
  const storedRefreshToken = await redisClient.get(`refresh-token:${userId}`);
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
  await redisClient.del(`refresh-token:${userId}`);

  //clear tokens from cookies
  res.clearCookie("accessToken", baseOptions);
  res.clearCookie("refreshToken", refreshTokenOptions);

  return res.status(200).json(new ApiResponse(200, "Logged out successfully"));
});

/**
 * @route POST /api/v1/auth/verify-email
 * @description controller to Verify email
 * @access public
 */
export const verifyEmail = AsyncHandler(async (req: any, res: any) => {
  const { id, verifyToken } = req.query;

  const storedVerifyToken = await redisClient.get(`verify-token:${id}`);

  if (verifyToken !== storedVerifyToken) {
    return res.status(400).json(new ApiError(400, "Email verification failed"));
  }

  const user = await prisma.user.update({
    where: { id },
    data: { isVerified: true },
  });

  await redisClient.del(`verify-token:${user.id}`);

  res.status(200).json(new ApiResponse(200, "Email verified successfully"));
});

/**
 * @route POST /auth/refresh-token
 * @desc Refresh access token controller
 * @access public
 */
export const refreshAccessToken = async (req: any, res: any) => {
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
    const { id, email, role } = decoded;

    const storedRefreshToken = await redisClient.get(`refresh-token:${id}`);

    if (!storedRefreshToken || storedRefreshToken !== refreshToken) {
      return res
        .status(401)
        .json(new ApiError(401, "Session expired. Please login again."));
    }

    const accessToken = jwt.sign({ id, email, role }, ENV.ACCESS_TOKEN_SECRET, {
      expiresIn: "15m",
    });

    res.cookie("accessToken", accessToken, baseOptions);

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

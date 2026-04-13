import jwt from "jsonwebtoken";
import ApiError from "../utils/api-error.js";
import type { IPayload } from "../types/jwt.types.js";
import { ENV } from "../lib/env.js";

const authMiddleware = async (req: any, res: any, next: any) => {
  try {
    const authorization = req?.headers?.authorization;
    const token = req?.cookies?.accessToken || authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json(new ApiError(401, "Unauthorized request"));
    }
    const decoded = jwt.verify(token, ENV.ACCESS_TOKEN_SECRET);

    req.user = decoded;
    next();
  } catch (error) {
    console.log(error);
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json(new ApiError(401, "Token expired"));
    }
    return res.status(401).json(new ApiError(401, "Unauthorized request"));
  }
};

const generateAccessToken = (userData: IPayload) => {
  return jwt.sign(userData, ENV.ACCESS_TOKEN_SECRET, { expiresIn: "1m" });
};

const generateRefreshToken = (userData: IPayload) => {
  return jwt.sign(userData, ENV.REFRESH_TOKEN_SECRET, { expiresIn: "7d" });
};

export { authMiddleware, generateAccessToken, generateRefreshToken };

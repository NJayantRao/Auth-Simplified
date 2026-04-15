import { ENV } from "../lib/env.js";

const baseOptions = {
  httpOnly: true,
  secure: ENV.NODE_ENV == "PRODUCTION",
  sameSite:
    ENV.NODE_ENV === "PRODUCTION" ? ("none" as const) : ("lax" as const),
  maxAge: 15 * 60 * 1000,
};

const refreshTokenOptions = {
  httpOnly: true,
  secure: ENV.NODE_ENV === "PRODUCTION",
  sameSite:
    ENV.NODE_ENV === "PRODUCTION" ? ("none" as const) : ("lax" as const),
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

export { baseOptions, refreshTokenOptions };

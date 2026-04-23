import { decodeIdToken, generateCodeVerifier, generateState } from "arctic";
import AsyncHandler from "../utils/async-handler.js";
import { google } from "../utils/google.js";
import { redisClient } from "../lib/redis.js";
import { User } from "../models/user.model.js";
import { OAuthProvider } from "../models/oAuth.model.js";
import type { IPayload } from "../types/jwt.types.js";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../middlewares/auth-middleware.js";
import { accessTokenOptions, refreshTokenOptions } from "../utils/constants.js";
import { github } from "../utils/github.js";
import crypto from "crypto";
import { ENV } from "../lib/env.js";
import mongoose from "mongoose";
import ApiError from "../utils/api-error.js";
import { sendOauthWelcomeMail } from "../utils/send-mails.js";

/**
 * @route POST /auth/google
 * @desc controller to oauth google login
 * @access public
 */
export const googleLogin = AsyncHandler(async (req: any, res: any) => {
  const state = generateState();
  const codeVerifier = generateCodeVerifier();
  const scopes = ["openid", "profile", "email"];
  const url = google.createAuthorizationURL(state, codeVerifier, scopes);
  await redisClient.set(
    `oauth:google-state:${state}`,
    codeVerifier,
    "EX",
    5 * 60
  );
  // res.cookie("google_oauth_state", state, accessTokenOptions);
  // res.cookie("google_oauth_codeVerifier", codeVerifier, accessTokenOptions);
  res.redirect(url.toString());
});

/**
 * @route POST /auth/google/callback
 * @desc controller to oauth google login callback
 * @access public
 */
export const getGoogleLoginCallback = AsyncHandler(
  async (req: any, res: any) => {
    const { code, state } = req.query;
    // console.log(code);
    // console.log(state);

    const storedCodeVerifier = await redisClient.get(
      `oauth:google-state:${state}`
    );

    if (!code || !state || !storedCodeVerifier) {
      return res.redirect(
        `${ENV.FRONTEND_URL}/sign-in?error=oauth_state_mismatch`
      );
    }
    try {
      let tokens = await google.validateAuthorizationCode(
        code,
        storedCodeVerifier
      );

      const idToken = tokens.idToken();
      const claims: any = decodeIdToken(idToken);

      const googleUserId = claims.sub;
      const name = claims.name;
      const email = claims.email;

      let oauthAccount = await OAuthProvider.findOne({
        providerName: "GOOGLE",
        providerUserId: googleUserId,
      });

      let user;

      if (oauthAccount) {
        user = await User.findById(oauthAccount.userId);
      } else {
        const session = await mongoose.startSession();
        session.startTransaction();

        try {
          let existingUser = await User.findOne({ email }).session(session);

          if (!existingUser) {
            existingUser = await new User({
              name,
              email,
              isVerified: true,
            }).save({ session });
          }

          await new OAuthProvider({
            userId: existingUser._id,
            providerName: "GOOGLE",
            providerUserId: googleUserId,
          }).save({ session });

          await session.commitTransaction();
          session.endSession();

          user = existingUser;
        } catch (error) {
          await session.abortTransaction();
          session.endSession();
          throw new ApiError(500, "User creation failed");
        }
      }

      if (!user)
        return res.redirect(
          `${ENV.FRONTEND_URL}/sign-in?error=user_creation_failed`
        );

      const sessionId = crypto.randomBytes(16).toString("hex");
      const payload: IPayload = {
        id: user.id,
        email: user.email,
        role: user.role,
        sessionId,
      };

      const accessToken = generateAccessToken(payload);
      const refreshToken = generateRefreshToken(payload);

      // set refresh token in redis
      await redisClient.set(
        `refresh-token:${user.id}`,
        refreshToken,
        "EX",
        7 * 24 * 60 * 60
      );
      // set active session ID
      await redisClient.set(
        `active-session:${user.id}`,
        sessionId,
        "EX",
        7 * 24 * 60 * 60
      );

      await redisClient.del(`oauth:google-state:${state}`);
      res.cookie("accessToken", accessToken, accessTokenOptions);
      res.cookie("refreshToken", refreshToken, refreshTokenOptions);

      sendOauthWelcomeMail(
        user?.name,
        user?.email,
        "Google",
        `${ENV.FRONTEND_URL}/dashboard`
      );

      // 6 Redirect to frontend dashboard
      return res.redirect(`${ENV.FRONTEND_URL}/dashboard`);
    } catch (error) {
      console.log("Google OAuth Error:", error);
      return res.redirect(
        `${ENV.FRONTEND_URL}/sign-in?error=google_oauth_failed`
      );
    }
  }
);

/**
 * @route POST /auth/github
 * @desc controller to oauth github login
 * @access public
 */
export const githubLogin = AsyncHandler(async (req: any, res: any) => {
  const state = generateState();
  const url = github.createAuthorizationURL(state, ["user:email"]);
  await redisClient.set(
    `oauth:github-state:${state}`,
    "VALID_GITHUB_STATE",
    "EX",
    5 * 60
  );
  // res.cookie("github_oauth_state", state, accessTokenOptions);
  res.redirect(url.toString());
});

/**
 * @route POST /auth/github/callback
 * @desc controller to oauth github login callback
 * @access public
 */
export const getGithubLoginCallback = AsyncHandler(
  async (req: any, res: any) => {
    const { code, state } = req.query;
    // console.log("Github Code:", code);
    // console.log("Github State:", state);

    // const storedState = req.cookies.github_oauth_state;

    if (!code || !state) {
      return res.redirect(
        `${ENV.FRONTEND_URL}/sign-in?error=oauth_state_mismatch`
      );
    }
    const stored = await redisClient.get(`oauth:github-state:${state}`);

    if (!stored) {
      return res.redirect(
        `${ENV.FRONTEND_URL}/sign-in?error=invalid_or_expired_state`
      );
    }
    try {
      let tokens = await github.validateAuthorizationCode(code);
      const accessToken = tokens.accessToken();

      const githubUserResponse = await fetch("https://api.github.com/user", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const githubUser: any = await githubUserResponse.json();

      const githubUserId = String(githubUser.id);
      const name = githubUser.name || githubUser.login;

      let email = githubUser.email;

      if (!email) {
        const emailsResponse = await fetch(
          "https://api.github.com/user/emails",
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        const emails: any = await emailsResponse.json();
        const primaryEmail = emails.find((e: any) => e.primary) ?? emails[0];
        email = primaryEmail.email;
      }

      let oauthAccount = await OAuthProvider.findOne({
        providerName: "GITHUB",
        providerUserId: githubUserId,
      });

      let user;

      if (oauthAccount) {
        user = await User.findById(oauthAccount.userId);
      } else {
        const session = await mongoose.startSession();
        session.startTransaction();

        try {
          let existingUser = await User.findOne({ email }).session(session);

          if (!existingUser) {
            existingUser = await new User({
              name,
              email,
              isVerified: true,
            }).save({ session });
          }

          await new OAuthProvider({
            userId: existingUser._id,
            providerName: "GITHUB",
            providerUserId: githubUserId,
          }).save({ session });

          await session.commitTransaction();
          session.endSession();

          user = existingUser;
        } catch (error) {
          await session.abortTransaction();
          session.endSession();
          throw error;
        }
      }

      if (!user) {
        return res.redirect(
          `${ENV.FRONTEND_URL}/sign-in?error=user_creation_failed`
        );
      }

      const sessionId = crypto.randomBytes(16).toString("hex");
      const payload: IPayload = {
        id: user.id,
        email: user.email,
        role: user.role,
        sessionId,
      };

      const loginAccessToken = generateAccessToken(payload);
      const refreshToken = generateRefreshToken(payload);

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
      await redisClient.del(`oauth:github-state:${state}`);
      res.cookie("accessToken", loginAccessToken, accessTokenOptions);
      res.cookie("refreshToken", refreshToken, refreshTokenOptions);
      sendOauthWelcomeMail(
        user?.name,
        user?.email,
        "GitHub",
        `${ENV.FRONTEND_URL}/dashboard`
      );

      return res.redirect(`${ENV.FRONTEND_URL}/dashboard`);
    } catch (error) {
      console.log("GitHub OAuth Error:", error);
      return res.redirect(
        `${ENV.FRONTEND_URL}/sign-in?error=github_oauth_failed`
      );
    }
  }
);

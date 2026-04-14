import dotenv from "dotenv";

dotenv.config({ quiet: true });

const ENV = {
  NODE_ENV: process.env.NODE_ENV!,
  PORT: process.env.PORT!,
  DATABASE_URL: process.env.DATABASE_URL!,
  EMAIL_USER: process.env.EMAIL_USER!,
  CLIENT_ID: process.env.CLIENT_ID!,
  CLIENT_SECRET: process.env.CLIENT_SECRET!,
  GMAIL_REFRESH_TOKEN: process.env.GMAIL_REFRESH_TOKEN!,
  ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET!,
  REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET!,
  FRONTEND_URL: process.env.FRONTEND_URL!,
};

export { ENV };

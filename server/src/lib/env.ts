import dotenv from "dotenv";

dotenv.config({ quiet: true });

const ENV = {
  PORT: process.env.PORT!,
  DATABASE_URL: process.env.DATABASE_URL!,
  EMAIL_USER: process.env.EMAIL_USER!,
  CLIENT_ID: process.env.CLIENT_ID!,
  CLIENT_SECRET: process.env.CLIENT_SECRET!,
  REFRESH_TOKEN: process.env.REFRESH_TOKEN!,
};

export { ENV };

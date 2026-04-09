import dotenv from "dotenv";

dotenv.config({ quiet: true });

const ENV = {
  PORT: process.env.PORT!,
  DATABASE_URL: process.env.DATABASE_URL!,
};

export { ENV };

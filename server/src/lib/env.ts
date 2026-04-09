import dotenv from "dotenv";

dotenv.config({ quiet: true });

const ENV = {
  PORT: process.env.PORT,
};

export { ENV };

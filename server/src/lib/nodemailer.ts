import nodemailer from "nodemailer";
import { ENV } from "./env.js";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    type: "OAuth2",
    user: ENV.EMAIL_USER,
    clientId: ENV.CLIENT_ID,
    clientSecret: ENV.CLIENT_SECRET,
    refreshToken: ENV.GMAIL_REFRESH_TOKEN,
  },
});

const connectToTransporter = async () => {
  try {
    await transporter.verify();
    console.log("Server is ready to take our messages");
  } catch (err) {
    console.error("Verification failed:", err);
  }
};

export { transporter, connectToTransporter };

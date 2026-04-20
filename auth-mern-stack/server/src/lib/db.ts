import mongoose from "mongoose";
import { ENV } from "./env.js";

const connectToDB = async () => {
  mongoose.connect(ENV.DATABASE_URL);
  const db = mongoose.connection;

  db.on("connected", () => {
    console.log("✅ Mongo DB connected successfully...");
  });

  db.on("disconnect", () => {
    console.log("❌ Mongo DB disconnectd!");
  });

  db.on("error", (error) => {
    console.log("❌ Error in connecting Mongo DB...", error);
  });
};

export default connectToDB;

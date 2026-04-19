import mongoose from "mongoose";
import type { IOAuthProviderSchema } from "../types/mongoose.types.js";

const oAuthSchema = new mongoose.Schema<IOAuthProviderSchema>(
  {
    providerName: {
      type: String,
      required: true,
      enum: ["LOCAL", "GOOGLE", "GITHUB"],
    },
    providerUserId: {
      type: String,
      required: true,
    },
    userId: {
      type: mongoose.Types.ObjectId,
      required: true,
    },
  },
  { timestamps: true }
);

const OAuthProvider = mongoose.model("oAuthProviders", oAuthSchema);

export { OAuthProvider };

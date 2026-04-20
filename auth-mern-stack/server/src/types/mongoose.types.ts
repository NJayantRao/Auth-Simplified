import mongoose from "mongoose";

interface IUserSchema {
  _id: mongoose.Types.ObjectId;
  name: string;
  email: string;
  password: string;
  role: "USER" | "ADMIN";
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface IOAuthProviderSchema {
  _id: mongoose.Types.ObjectId;
  providerName: string;
  providerUserId: string;
  userId: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export type { IUserSchema, IOAuthProviderSchema };

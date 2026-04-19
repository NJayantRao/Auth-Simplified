import mongoose from "mongoose";
import bcrypt from "bcrypt";
import type { IUserSchema } from "../types/mongoose.types.js";

const userSchema = new mongoose.Schema<IUserSchema>(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: false,
    },
    role: {
      type: String,
      required: true,
      enum: ["USER", "ADMIN"],
      default: "USER",
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function () {
  const user = this;
  if (user.isModified("password")) {
    try {
      //generate salt
      const salt = await bcrypt.genSalt(10);

      const hashedPassword = await bcrypt.hash(user.password, salt);
      user.password = hashedPassword;
    } catch (error) {
      console.error(error);
    }
  }
});

userSchema.methods.comparePassword = async function ({
  userPassword,
}: {
  userPassword: string;
}) {
  try {
    const isMatch = bcrypt.compare(userPassword, this.password);
    return isMatch;
  } catch (error) {
    console.log(error);
  }
};

const User = mongoose.model("users", userSchema);

export { User };

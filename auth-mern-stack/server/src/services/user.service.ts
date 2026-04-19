import { User } from "../models/user.model.js";

const existingUser = async (email: string) => {
  return User.findOne({ email });
};

import { User } from "../models/user.model.js";

const existingUser = async (email: string) => {
  return User.findOne({ email });
};

const createUser = async (name: string, email: string, password: string) => {
  const createdUser = await User.create({
    name,
    email,
    password,
  });
  return createdUser;
};

export { existingUser, createUser };

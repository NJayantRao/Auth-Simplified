import { z } from "zod";

export const registerSchema = z.object({
  name: z.string(),
  email: z.string().email({ message: "Invalid Email address" }),
  password: z.string().min(8),
});

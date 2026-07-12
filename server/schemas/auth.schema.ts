import { z } from "zod";
import bcrypt from "bcryptjs";

export const loginSchema = z.object({
  username: z.string().trim().min(1).optional(),
  password: z.string().min(1, "Password is required"),
});

export const registerSchema = z.object({
  email: z.string().email().optional(),
  username: z.string().trim().min(1),
  password: z.string().min(6, "Password must be at least 6 characters"),
  firstName: z.string().trim().min(1),
  lastName: z.string().trim().min(1),
  departmentId: z.number().int(),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;

export const hashPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

export const comparePassword = (
  password: string,
  hash: string,
): Promise<boolean> => {
  return bcrypt.compare(password, hash);
};

import { z } from "zod";

export const loginSchema = z.object({
  email_username: z.string().trim().min(1).optional(),
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

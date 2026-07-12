import z from "zod";
import bcrypt from "bcryptjs";

export const userSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  username: z.string().trim().min(1),
  password_hash: z.string(),
  firstName: z.string().trim().min(1),
  lastName: z.string().trim().min(1),
  createdAt: z.date().optional(),
  role: z.enum(["USER", "MANAGER", "ADMIN"]).optional(),
  active: z.boolean().optional(),
  departmentId: z.number().int(),
});

export type UserType = z.infer<typeof userSchema>;

import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export type SessionUser = {
  userId: string;
  username: string;
  firstName: string | null;
  lastName: string | null;
  email: string | null;
  role: "USER" | "MANAGER" | "ADMIN";
};

export async function getSessionUser(): Promise<SessionUser | null> {
  const token = (await cookies()).get("token")?.value;
  if (!token) return null;

  try {
    return jwt.verify(token, process.env.JWT_SECRET!) as SessionUser;
  } catch {
    return null;
  }
}

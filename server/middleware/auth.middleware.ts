import { type NextFunction, type Request, type Response } from "express";
import jwt from "jsonwebtoken";
import { verifyToken, type JwtPayload } from "@utils/jwt.utils.js";
import userService from "@services/user.services.js";

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ error: "Missing or invalid authorization header" });
  }

  const token = authHeader.slice("Bearer ".length);

  let payload: JwtPayload;
  try {
    payload = verifyToken(token);
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({ error: "Token expired" });
    }
    return res.status(401).json({ error: "Invalid token" });
  }

  const user = await userService.findById(payload.userId);
  if (!user || !user.active) {
    return res.status(401).json({ error: "Account not found or inactive" });
  }

  req.user = {
    userId: user.id,
    username: user.username ?? null,
    role: user.role,
  };
  next();
};

export const authorize = (...roles: JwtPayload["role"][]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: "Not authenticated" });
    }
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: "Insufficient permissions" });
    }
    next();
  };
};

import { type Request, type Response } from "express";
import { Prisma } from "../generated/prisma/client.ts";
import { email, z } from "zod";
import userService from "@services/user.services.js";
import { comparePassword } from "@schemas/auth.schema.js";
import { loginSchema, registerSchema } from "@schemas/auth.schema.js";
import { signToken } from "@utils/jwt.utils.js";
import { setAuthCookie, clearAuthCookie } from "@utils/cookie.utils.js";
import authService from "@services/auth.services.js";

const authController = {
  /**
   * Handles user login
   * @param req - Express request object containing login credentials
   * @param res - Express response object used to send the response back to the client
   * @returns A JSON response indicating the result of the login attempt
   */
  login: async (req: Request, res: Response) => {
    try {
      const parsed = loginSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({
          error: "Invalid request body",
          details: z.flattenError(parsed.error),
        });
      }

      if (!parsed.data.username || !parsed.data.password) {
        return res
          .status(400)
          .json({ error: "Username and password are required" });
      }

      const user = await userService.findByEmailOrUsername(
        parsed.data.username,
      );
      if (!user) {
        return res.status(401).json({ error: "Invalid username or password" });
      }

      const passwordMatches = await comparePassword(
        parsed.data.password,
        user.password_hash,
      );
      if (!passwordMatches) {
        return res.status(401).json({ error: "Invalid username or password" });
      }

      const token = signToken({
        userId: user.id,
        email: user.email ?? null,
        firstName: user.firstName ?? null,
        lastName: user.lastName ?? null,
        username: user.username ?? null,
        role: user.role,
      });

      const settings = await userService.getSettings(user.id);

      setAuthCookie(res, token);
      res.status(200).json({ message: "Login successful", settings });
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  },

  /**
   * Handles user registration
   * @param req - Express request object containing registration details
   * @param res - Express response object used to send the response back to the client
   * @returns A JSON response indicating the result of the registration attempt
   */
  register: async (req: Request, res: Response) => {
    try {
      const parsed = registerSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({
          error: "Invalid request body",
          details: z.flattenError(parsed.error),
        });
      }

      const user = await authService.createUser(parsed.data);
      const token = signToken({
        userId: user.id,
        email: user.email ?? null,
        firstName: user.firstName ?? null,
        lastName: user.lastName ?? null,
        username: user.username ?? null,
        role: user.role,
      });

      setAuthCookie(res, token);
      res.status(201).json({ message: "Registration successful" });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2002") {
          return res
            .status(400)
            .json({ error: "An account with that username already exists" });
        }
        if (error.code === "P2003") {
          return res.status(400).json({ error: "Department does not exist" });
        }
      }
      res.status(500).json({ error: "Internal Server Error" });
    }
  },

  /**
   * Handles user logout by clearing the authentication cookie
   * @param res - Express response object used to send the response back to the client
   * @returns A JSON response indicating the result of the logout attempt
   */
  logout: (_req: Request, res: Response) => {
    clearAuthCookie(res);
    res.status(200).json({ message: "Logout successful" });
  },
};

export default authController;

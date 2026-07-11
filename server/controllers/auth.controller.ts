import { type Request, type Response } from "express";
import { Prisma } from "../generated/prisma/client.ts";
import { z } from "zod";
import userService from "@services/user.services.js";
import { comparePassword } from "@schemas/user.schema.js";
import { loginSchema, registerSchema } from "@schemas/auth.schema.js";
import { signToken } from "@utils/jwt.utils.js";

const authController = {
  login: async (req: Request, res: Response) => {
    try {
      const parsed = loginSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({
          error: "Invalid request body",
          details: z.flattenError(parsed.error),
        });
      }

      if (!parsed.data.email_username || !parsed.data.password) {
        return res
          .status(400)
          .json({ error: "Email and password are required" });
      }

      const user = await userService.findByEmailOrUsername(
        parsed.data.email_username,
      );
      if (!user) {
        return res.status(401).json({ error: "Invalid email or password" });
      }

      const passwordMatches = await comparePassword(
        parsed.data.password,
        user.password_hash,
      );
      if (!passwordMatches) {
        return res.status(401).json({ error: "Invalid email or password" });
      }

      const token = signToken({
        userId: user.id,
        username: user.username ?? null,
        role: user.role,
      });

      res.status(200).json({ token });
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  },

  register: async (req: Request, res: Response) => {
    try {
      const parsed = registerSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({
          error: "Invalid request body",
          details: z.flattenError(parsed.error),
        });
      }

      const user = await userService.createUser(parsed.data);
      const token = signToken({
        userId: user.id,
        username: user.username ?? null,
        role: user.role,
      });

      res.status(201).json({ token });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2002") {
          return res
            .status(400)
            .json({ error: "An account with that email already exists" });
        }
        if (error.code === "P2003") {
          return res.status(400).json({ error: "Department does not exist" });
        }
      }
      res.status(500).json({ error: "Internal Server Error" });
    }
  },
};

export default authController;

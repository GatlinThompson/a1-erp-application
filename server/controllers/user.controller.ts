import { type Request, type Response } from "express";
import { z } from "zod";
import userService from "@services/user.services.js";
import { userSettingsSchema } from "@schemas/user.schema.js";

const userController = {
  /**
   * Retrieves the authenticated user's settings.
   * @param req  The request object
   * @param res  The response object
   * @returns  The user's settings
   */
  getSettings: async (req: Request, res: Response) => {
    try {
      const settings = await userService.getSettings(req.user!.userId);
      res.status(200).json(settings);
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  },

  /**
   * Updates (merges) the authenticated user's settings.
   * @param req  The request object
   * @param res  The response object
   * @returns  The updated settings
   */
  updateSettings: async (req: Request, res: Response) => {
    try {
      const parsed = userSettingsSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({
          error: "Invalid request body",
          details: z.flattenError(parsed.error),
        });
      }

      const settings = await userService.updateSettings(
        req.user!.userId,
        parsed.data,
      );
      res.status(200).json(settings);
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  },
};

export default userController;

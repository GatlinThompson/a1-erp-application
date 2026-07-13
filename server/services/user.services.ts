import prisma from "@lib/prisma.js";
import { Prisma } from "../generated/prisma/client.ts";

const userService = {
  findByEmail: async (email: string) => {
    return prisma.user.findUnique({ where: { email } });
  },

  findByUsername: async (username: string) => {
    return prisma.user.findUnique({ where: { username } });
  },

  findByEmailOrUsername: async (emailOrUsername: string) => {
    return prisma.user.findFirst({
      where: {
        OR: [{ email: emailOrUsername }, { username: emailOrUsername }],
      },
    });
  },

  findById: async (id: string) => {
    return prisma.user.findUnique({ where: { id } });
  },

  getSettings: async (userId: string) => {
    const record = await prisma.userSettings.findUnique({ where: { userId } });
    return (record?.settings as Prisma.InputJsonObject) ?? {};
  },

  updateSettings: async (userId: string, settings: Prisma.InputJsonObject) => {
    const record = await prisma.userSettings.findUnique({ where: { userId } });
    const merged: Prisma.InputJsonObject = {
      ...((record?.settings as Prisma.InputJsonObject) ?? {}),
      ...settings,
    };

    const updated = await prisma.userSettings.upsert({
      where: { userId },
      update: { settings: merged },
      create: { userId, settings: merged },
    });

    return updated.settings as Record<string, unknown>;
  },
};

export default userService;

import prisma from "@lib/prisma.js";

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
};

export default userService;

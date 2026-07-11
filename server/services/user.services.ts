import prisma from "@lib/prisma.js";
import type { RegisterInput } from "@schemas/auth.schema.js";
import { hashPassword } from "@schemas/user.schema.js";
import { uuid } from "zod";

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

  createUser: async (data: RegisterInput) => {
    const password_hash = await hashPassword(data.password);
    return prisma.user.create({
      data: {
        email: data.email ? data.email : undefined,
        username: data.username,
        password_hash,
        firstName: data.firstName,
        lastName: data.lastName,
        departmentId: data.departmentId,
      },
    });
  },
};

export default userService;

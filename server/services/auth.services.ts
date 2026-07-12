import { hashPassword, type RegisterInput } from "@schemas/auth.schema.js";
import prisma from "@lib/prisma.js";

const authService = {
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

export default authService;

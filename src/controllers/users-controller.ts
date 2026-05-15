import { prisma } from "@/database/prisma.js";
import type { Response, Request, NextFunction } from "express";
import z from "zod";
import { UserRole } from "@prisma/client";

class UsersController {
  async createUser(request: Request, response: Response, next: NextFunction) {
    const bodySchema = z.object({
      name: z.string().trim().min(1).toLowerCase(),
      email: z.email().trim().toLowerCase(),
      password: z.string().min(6),
      role: z
        .enum([UserRole.employee, UserRole.manager])
        .default(UserRole.employee),
    });

    const { name, email, password, role } = bodySchema.parse(request.body);

    const userCreated = await prisma.user.create({
      data: {
        name,
        email,
        password,
        role,
      },
    });

    const { password: _, ...userWithoutPassword } = userCreated;

    return response.status(201).json(userWithoutPassword);
  }
}

export { UsersController };

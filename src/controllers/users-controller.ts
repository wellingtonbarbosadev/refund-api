import { prisma } from "@/database/prisma.js";
import type { Response, Request, NextFunction } from "express";
import z from "zod";
import { UserRole } from "@prisma/client";
import { AppError } from "@/utils/AppError.js";
import { hash } from "bcrypt-ts";

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

    const userWithSameEmail = await prisma.user.findUnique({
      where: { email },
    });

    if (userWithSameEmail) {
      throw new AppError("Email already in use", 409);
    }

    const hashedPassword = await hash(password, 10);

    const userCreated = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role,
      },
    });

    const { password: _, ...userWithoutPassword } = userCreated;

    return response.status(201).json(userWithoutPassword);
  }
}

export { UsersController };

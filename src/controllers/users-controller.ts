import { prisma } from "@/database/prisma.js";
import type { Response, Request, NextFunction } from "express";
import z from "zod";

class UsersController {
  async createUser(request: Request, response: Response, next: NextFunction) {
    const bodySchema = z.object({
      name: z.string(),
      email: z.email(),
      password: z.string().min(6),
    });

    const { name, email, password } = bodySchema.parse(request.body);

    const userCreated = await prisma.user.create({
      data: {
        name,
        email,
        password,
      },
    });

    const { password: _, ...userWithoutPassword } = userCreated;

    return response.status(201).json(userWithoutPassword);
  }
  listAllUsers() {
    return "List of all users";
  }
}

import { prisma } from "@/database/prisma.js";
import { AppError } from "@/utils/AppError.js";
import type { Request, Response, NextFunction } from "express";
import { compare } from "bcrypt-ts";
import z from "zod";

class SessionsController {
  async createSession(
    request: Request,
    response: Response,
    next: NextFunction,
  ) {
    const bodySchema = z.object({
      email: z.email().trim().toLowerCase(),
      password: z.string().min(6),
    });

    const { email, password } = bodySchema.parse(request.body);

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new AppError("Invalid credentials", 401);
    }

    if (!(await compare(password, user.password))) {
      throw new AppError("Invalid credentials", 401);
    }

    return response
      .status(201)
      .json({ message: "Session created successfully" });
  }
}

export { SessionsController };

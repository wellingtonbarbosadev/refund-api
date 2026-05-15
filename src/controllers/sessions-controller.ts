import { prisma } from "@/database/prisma.js";
import { AppError } from "@/utils/AppError.js";
import type { Request, Response, NextFunction } from "express";
import { compare } from "bcrypt-ts";
import z from "zod";
import { authConfig } from "@/configs/auth.js";
import jwt from "jsonwebtoken";
import type { SignOptions } from "jsonwebtoken";

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

    const { secret, expiresIn } = authConfig.jwt;

    const token = jwt.sign({ role: user.role }, secret, {
      subject: String(user.id),
      expiresIn: expiresIn as SignOptions["expiresIn"],
    });

    const { password: _, ...userWithoutPassword } = user;

    return response.status(201).json({ token, user: userWithoutPassword });
  }
}

export { SessionsController };

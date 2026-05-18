import { AppError } from "@/utils/AppError.js";
import type { UserRole } from "@prisma/client";
import type { Request, Response, NextFunction } from "express";

export function verifyUserAuthorization(roles: UserRole[]) {
  return (request: Request, response: Response, next: NextFunction) => {
    if (!request.user) {
      return response.status(401).json({ message: "User not authenticated" });
    }

    if (!roles.includes(request.user.role as UserRole)) {
      throw new AppError("Unauthorized", 403);
    }

    return next();
  };
}

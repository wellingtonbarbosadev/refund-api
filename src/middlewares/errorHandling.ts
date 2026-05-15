import { AppError } from "../utils/AppError.js";
import z, { ZodError } from "zod";
import type { ErrorRequestHandler } from "express";

export const errorHandling: ErrorRequestHandler = (
  error,
  request,
  response,
  next,
) => {
  if (error instanceof AppError) {
    response.status(error.statusCode).json({
      message: error.message,
    });

    return;
  }

  if (error instanceof ZodError) {
    response.status(400).json({
      message: "validation error",
      issues: z.treeifyError(error),
    });

    return;
  }

  response.status(500).json({ message: error.message });
  return;
};

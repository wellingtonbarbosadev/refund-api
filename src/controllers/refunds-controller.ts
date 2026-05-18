import { prisma } from "@/database/prisma.js";
import { Category } from "@prisma/client";
import type { Request, Response } from "express";
import z from "zod";

class RefundsController {
  async createRefund(request: Request, response: Response) {
    const bodySchema = z.object({
      name: z.string(),
      amount: z.number(),
      userId: z.string(),
      category: z.enum(Category),
      filename: z.string(),
    });

    const { name, amount, userId, category, filename } = bodySchema.parse(
      request.body,
    );

    const refund = await prisma.refunds.create({
      data: {
        name,
        amount,
        userId,
        category,
        filename,
      },
    });

    return response
      .status(201)
      .json({ message: "Refund created successfully", refund });
  }
}

export { RefundsController };

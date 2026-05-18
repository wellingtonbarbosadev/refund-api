import { prisma } from "@/database/prisma.js";
import { Category } from "@prisma/client";
import type { Request, Response } from "express";
import z from "zod";

class RefundsController {
  async createRefund(request: Request, response: Response) {
    const bodySchema = z.object({
      name: z.string(),
      amount: z.number(),
      category: z.enum(Category),
      filename: z.string(),
    });

    const { name, amount, category, filename } = bodySchema.parse(request.body);

    if (!request.user) {
      return response.status(401).json({ message: "User not authenticated" });
    }

    const refund = await prisma.refunds.create({
      data: {
        name,
        amount,
        userId: request.user.id,
        category,
        filename,
      },
    });

    return response
      .status(201)
      .json({ message: "Refund created successfully", refund });
  }

  async listRefunds(request: Request, response: Response) {
    const querySchema = z.object({
      name: z.string().optional().default(""),
      page: z.coerce.number().optional().default(1),
      perPage: z.coerce.number().optional().default(10),
    });

    const { name, page, perPage } = querySchema.parse(request.query);

    const skip = (page - 1) * perPage;

    const totalRecords = await prisma.refunds.count({
      where: {
        user: {
          name: {
            contains: name.trim(),
          },
        },
      },
    });

    const totalPages = Math.ceil(totalRecords / perPage);

    const refunds = await prisma.refunds.findMany({
      skip,
      take: perPage,
      where: {
        user: {
          name: {
            contains: name.trim(),
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        user: true,
      },
    });
    return response.status(200).json({
      refunds,
      pagination: {
        page,
        perPage,
        totalPages: totalPages > 0 ? totalPages : 1,
        totalRecords,
      },
    });
  }

  async getRefundById(request: Request, response: Response) {
    const querySchema = z.object({
      id: z.uuid(),
    });

    const { id } = querySchema.parse(request.params);

    const refund = await prisma.refunds.findUnique({
      where: {
        id,
      },
      include: {
        user: true,
      },
    });
    return response.status(200).json(refund);
  }
}

export { RefundsController };

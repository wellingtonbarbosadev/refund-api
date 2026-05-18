import type { Request, Response } from "express";

class RefundsController {
  async createRefund(request: Request, response: Response) {
    return response.json({ message: "Refund created successfully" });
  }
}

export { RefundsController };

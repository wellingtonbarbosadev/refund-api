import { RefundsController } from "@/controllers/refunds-controller.js";
import { Router } from "express";

const refundsRoutes = Router();
const refundsController = new RefundsController();

refundsRoutes.post("/", refundsController.createRefund);

export { refundsRoutes };

import { RefundsController } from "@/controllers/refunds-controller.js";
import { verifyUserAuthorization } from "@/middlewares/verify-user-authorization.js";
import { Router } from "express";

const refundsRoutes = Router();
const refundsController = new RefundsController();

refundsRoutes.post(
  "/",
  verifyUserAuthorization(["employee", "manager"]),
  refundsController.createRefund,
);

refundsRoutes.get(
  "/",
  verifyUserAuthorization(["manager"]),
  refundsController.listRefunds,
);

refundsRoutes.get(
  "/:id",
  verifyUserAuthorization(["employee", "manager"]),
  refundsController.getRefundById,
);

export { refundsRoutes };

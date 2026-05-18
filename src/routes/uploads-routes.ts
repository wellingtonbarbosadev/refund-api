import { UploadsController } from "@/controllers/uploads-controller.js";
import { ensureAuthenticated } from "@/middlewares/ensure-authenticated.js";
import { verifyUserAuthorization } from "@/middlewares/verify-user-authorization.js";
import uploadConfig from "@/configs/upload.js";
import { Router } from "express";
import multer from "multer";

const uploadsRoutes = Router();
const uploadsController = new UploadsController();

const upload = multer(uploadConfig.MULTER);

uploadsRoutes.use(
  ensureAuthenticated,
  verifyUserAuthorization(["employee", "manager"]),
);
uploadsRoutes.post("/", upload.single("file"), uploadsController.upload);

export { uploadsRoutes };

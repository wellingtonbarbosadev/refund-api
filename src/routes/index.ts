import { ensureAuthenticated } from "@/middlewares/ensure-authenticated.js";
import { refundsRoutes } from "./refunds-routes.js";
import { sessionsRoutes } from "./sessions-routes.js";
import { usersRoutes } from "./users-routes.js";
import { Router } from "express";
import { verifyUserAuthorization } from "@/middlewares/verify-user-authorization.js";

const routes = Router();

routes.use("/users", usersRoutes);
routes.use("/sessions", sessionsRoutes);

routes.use(ensureAuthenticated);
routes.use("/refunds", refundsRoutes);

export { routes };

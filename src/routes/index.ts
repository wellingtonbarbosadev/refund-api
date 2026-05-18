import { refundsRoutes } from "./refunds-routes.js";
import { sessionsRoutes } from "./sessions-routes.js";
import { usersRoutes } from "./users-routes.js";
import { Router } from "express";

const routes = Router();

routes.use("/users", usersRoutes);
routes.use("/sessions", sessionsRoutes);

routes.use("/refunds", refundsRoutes);

export { routes };

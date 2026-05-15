import { usersRoutes } from "./users-routes.js";
import { Router } from "express";

const routes = Router();

routes.use("/users", usersRoutes);

export { routes };

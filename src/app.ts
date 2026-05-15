import express from "express";
import cors from "cors";

import { errorHandling } from "./middlewares/errorHandling.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use(errorHandling);

export { app };

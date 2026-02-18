import { Router } from "express";
import { GastoController } from "../controllers/gasto.controller.js";

export const gastoRouter = Router();

gastoRouter.get("/", GastoController.getAll);
gastoRouter.post("/filtrar", GastoController.filtrar);

export default gastoRouter;

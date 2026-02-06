import { Router } from "express";
import { GastoController } from "../controllers/gasto.controller.js";
import { errorHandler } from "../middlewares/ErrorHandler.js";

export const gastoRouter = Router();

gastoRouter.get("/por-validar", GastoController.getAllGastosPorValidar);
gastoRouter.get("/por-pagar", GastoController.getAllGastosPorPagar);
gastoRouter.post("/buscar", GastoController.getGastosByObra);
gastoRouter.post("/horas-extra/buscar", GastoController.getHorasExtraByObra);

gastoRouter.use(errorHandler);

export default gastoRouter;

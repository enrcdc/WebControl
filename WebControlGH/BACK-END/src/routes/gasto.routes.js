import { Router } from "express";
import { GastoController } from "../controllers/gasto.controller.js";

export const gastoRouter = Router();

gastoRouter.get("/", GastoController.getAll);
gastoRouter.post("/filtrar", GastoController.filtrar);
// TODO: Eliminar cuando el frontend use getAll(filters) o POST /filtrar
gastoRouter.post("/buscar", GastoController.getGastosByObra);
gastoRouter.post("/horas-extra/buscar", GastoController.getHorasExtraByObra);

export default gastoRouter;

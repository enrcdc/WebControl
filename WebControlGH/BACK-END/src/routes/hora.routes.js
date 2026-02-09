import { Router } from "express";
import { HoraController } from "../controllers/hora.controller.js";
import { errorHandler } from "../middlewares/ErrorHandler.js";

export const horasRouter = Router();

horasRouter.get("/", HoraController.getAllHoras);
horasRouter.post("/filtrar", HoraController.buscarConFiltros);
horasRouter.post("/buscar", HoraController.getByObra);
horasRouter.get(
  "/subordinados/:managerCodigo",
  HoraController.getHorasBySubordinados,
);
horasRouter.post("/", HoraController.create);

horasRouter.use(errorHandler);

export default horasRouter;

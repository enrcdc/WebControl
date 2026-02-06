import { Router } from "express";
import { HoraController } from "../controllers/hora.controller.js";
import { errorHandler } from "../middlewares/ErrorHandler.js";

export const horasRouter = Router();

horasRouter.post("/buscar", HoraController.getByObra);
horasRouter.get("/all", HoraController.getAllHoras);
horasRouter.get(
  "/subordinados/:managerCodigo",
  HoraController.getHorasBySubordinados
);

horasRouter.use(errorHandler);

export default horasRouter;

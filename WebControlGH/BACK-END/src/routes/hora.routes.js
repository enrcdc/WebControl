import { Router } from "express";
import { HoraController } from "../controllers/hora.controller.js";

export const horasRouter = Router();

horasRouter.get("/", HoraController.getAll);
horasRouter.post("/filtrar", HoraController.filtrar);
horasRouter.post("/", HoraController.create);

export default horasRouter;

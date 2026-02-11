import { Router } from "express";
import { EdificioController } from "../controllers/edificio.controller.js";

export const edificioRouter = Router();

edificioRouter.get("/", EdificioController.getAll);
// TODO: Eliminar cuando el frontend use getAll(filters)
edificioRouter.get("/buscar/nombre", EdificioController.getByNombre);

export default edificioRouter;

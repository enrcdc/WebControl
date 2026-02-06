import { Router } from "express";
import { EdificioController } from "../controllers/edificio.controller.js";
import { errorHandler } from "../middlewares/ErrorHandler.js";

export const edificioRouter = Router();

edificioRouter.get("/", EdificioController.getAll);
edificioRouter.get("/buscar/nombre", EdificioController.getByNombre)

edificioRouter.use(errorHandler);

export default edificioRouter;

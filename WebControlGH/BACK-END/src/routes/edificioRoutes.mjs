import { Router } from "express";
import { EdificioController } from "../controllers/edificioController.mjs";
import { errorHandler } from "../middlewares/ErrorHandler.mjs";

export const edificioRouter = Router();

edificioRouter.get("/", EdificioController.getAll);
edificioRouter.get("/buscar/nombre", EdificioController.getByNombre)

edificioRouter.use(errorHandler);

export default edificioRouter;

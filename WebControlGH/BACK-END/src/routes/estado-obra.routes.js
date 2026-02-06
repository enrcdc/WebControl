import { Router } from "express";
import { EstadoObraController } from "../controllers/estado-obra.controller.js";
import { errorHandler } from "../middlewares/ErrorHandler.js";

export const estadoObRouter = Router();

estadoObRouter.get("/", EstadoObraController.getAll);

estadoObRouter.use(errorHandler);

export default estadoObRouter;

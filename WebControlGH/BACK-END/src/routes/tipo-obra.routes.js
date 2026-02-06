import { Router } from "express";
import { TipoObraController } from "../controllers/tipo-obra.controller.js";
import { errorHandler } from "../middlewares/ErrorHandler.js";

export const tipoObRouter = Router();

tipoObRouter.get("/", TipoObraController.getAll);

tipoObRouter.use(errorHandler);

export default tipoObRouter;

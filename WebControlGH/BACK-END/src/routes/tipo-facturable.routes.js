import { Router } from "express";
import { TipoFacturableController } from "../controllers/tipo-facturable.controller.js";
import { errorHandler } from "../middlewares/ErrorHandler.js";

export const tiposFacRouter = Router();

tiposFacRouter.get("/", TipoFacturableController.getAll);

tiposFacRouter.use(errorHandler);

export default tiposFacRouter;

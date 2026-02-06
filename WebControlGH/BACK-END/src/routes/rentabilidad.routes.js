import { Router } from "express";
import { RentabilidadController } from "../controllers/rentabilidad.controller.js";
import { errorHandler } from "../middlewares/ErrorHandler.js";

export const rentabilidadRouter = Router();

rentabilidadRouter.get("/:idObra", RentabilidadController.getByIdObra);

rentabilidadRouter.use(errorHandler);

export default rentabilidadRouter;

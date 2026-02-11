import { Router } from "express";
import { RentabilidadController } from "../controllers/rentabilidad.controller.js";

export const rentabilidadRouter = Router();

rentabilidadRouter.get("/:idObra", RentabilidadController.getByIdObra);

export default rentabilidadRouter;

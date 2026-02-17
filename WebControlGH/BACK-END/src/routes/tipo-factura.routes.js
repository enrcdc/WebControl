import { Router } from "express";
import { TipoFacturaController } from "../controllers/tipo-factura.controller.js";

export const tipoFacRouter = Router();

tipoFacRouter.get("/", TipoFacturaController.getAll);

export default tipoFacRouter;

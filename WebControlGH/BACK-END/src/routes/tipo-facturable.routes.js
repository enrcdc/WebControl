import { Router } from "express";
import { TipoFacturableController } from "../controllers/tipo-facturable.controller.js";

export const tiposFacRouter = Router();

tiposFacRouter.get("/", TipoFacturableController.getAll);

export default tiposFacRouter;

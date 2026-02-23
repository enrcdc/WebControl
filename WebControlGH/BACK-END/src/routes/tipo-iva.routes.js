import { Router } from "express";
import { TipoIvaController } from "../controllers/tipo-iva.controller.js";

export const tipoIvaRouter = Router();

tipoIvaRouter.get("/", TipoIvaController.getAll);

export default tipoIvaRouter;

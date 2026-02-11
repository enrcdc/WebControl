import { Router } from "express";
import { TipoObraController } from "../controllers/tipo-obra.controller.js";

export const tipoObRouter = Router();

tipoObRouter.get("/", TipoObraController.getAll);

export default tipoObRouter;

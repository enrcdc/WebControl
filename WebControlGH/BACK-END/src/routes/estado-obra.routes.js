import { Router } from "express";
import { EstadoObraController } from "../controllers/estado-obra.controller.js";

export const estadoObRouter = Router();

estadoObRouter.get("/", EstadoObraController.getAll);

export default estadoObRouter;

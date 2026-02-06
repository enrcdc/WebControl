import { Router } from "express";
import { EmpresaController } from "../controllers/empresa.controller.js";
import { errorHandler } from "../middlewares/ErrorHandler.js";

export const empresaRouter = Router();

empresaRouter.get("/", EmpresaController.getAll);
empresaRouter.get("/buscar/nombre", EmpresaController.getByNombre)

empresaRouter.use(errorHandler);

export default empresaRouter;

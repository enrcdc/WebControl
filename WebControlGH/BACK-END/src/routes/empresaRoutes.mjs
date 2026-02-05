import { Router } from "express";
import { EmpresaController } from "../controllers/empresaController.mjs";
import { errorHandler } from "../middlewares/ErrorHandler.mjs";

export const empresaRouter = Router();

empresaRouter.get("/", EmpresaController.getAll);
empresaRouter.get("/buscar/nombre", EmpresaController.getByNombre)

empresaRouter.use(errorHandler);

export default empresaRouter;

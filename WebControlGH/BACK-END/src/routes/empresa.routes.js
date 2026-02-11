import { Router } from "express";
import { EmpresaController } from "../controllers/empresa.controller.js";

export const empresaRouter = Router();

empresaRouter.get("/", EmpresaController.getAll);
// TODO: Eliminar cuando el frontend use getAll(filters)
empresaRouter.get("/buscar/nombre", EmpresaController.getByNombre);

export default empresaRouter;

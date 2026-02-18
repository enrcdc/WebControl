import { Router } from "express";
import { EmpresaController } from "../controllers/empresa.controller.js";
import { validate } from "../middlewares/validate.js";
import {
  createEmpresaSchema,
  updateEmpresaSchema,
} from "../validations/empresaValidator.js";

export const empresaRouter = Router();

empresaRouter.get("/", EmpresaController.getAll);
// TODO: Eliminar cuando el frontend use getAll(filters)
empresaRouter.get("/buscar/nombre", EmpresaController.getByNombre);
empresaRouter.get("/:idEmpresa", EmpresaController.getById)
empresaRouter.post(
  "/",
  validate(createEmpresaSchema),
  EmpresaController.create,
);
empresaRouter.patch(
  "/:idEmpresa",
  validate(updateEmpresaSchema),
  EmpresaController.update,
);
// Los ids de las obras a dar de baja se obtienen del cuerpo
empresaRouter.delete("/", EmpresaController.delete);

export default empresaRouter;

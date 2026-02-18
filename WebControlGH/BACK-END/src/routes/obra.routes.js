import { ObraController } from "../controllers/obra.controller.js";
import { Router } from "express";
import { validate } from "../middlewares/validate.js";
import { createObraSchema, updateObraSchema } from "../validations/obrasValidator.js";

export const obraRouter = Router();

// CUIDADO. EL ORDEN DE LAS RUTAS AFECTA. SI PONES PRIMERO /:idObra,
// NO SE PROCESARÁN LAS RUTAS ESPECÍFICAS
obraRouter.get("/", ObraController.getAll);
obraRouter.get("/estadisticas", ObraController.getEstadisticas);
obraRouter.get("/:idObra", ObraController.getById);
obraRouter.post("/filtrar", ObraController.filtrar);
// FÍJATE EN COMO SE ESPECIFICA EL MIDDLEWARE DE VALIDACIÓN PARA LA RUTA DE POST
obraRouter.post("/", validate(createObraSchema), ObraController.create);
obraRouter.patch("/:idObra", validate(updateObraSchema), ObraController.update);
obraRouter.delete("/:idObra", ObraController.delete);

export default obraRouter;

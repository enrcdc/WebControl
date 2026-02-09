import { ObraController } from "../controllers/obra.controller.js";
import { Router } from "express";
import { errorHandler } from "../middlewares/ErrorHandler.js";

export const obraRouter = Router();

// CUIDADO. EL ORDEN DE LAS RUTAS AFECTA. SI PONES PRIMERO /:idObra,
// NO SE PROCESARÁN LAS RUTAS DE FILTRADO
obraRouter.get("/", ObraController.getAll);
// TODO: Quitar este endpoint porque /filtrar ya hace su trabajo
obraRouter.get("/buscar/descripcion", ObraController.getByDescripcion);
obraRouter.get("/:idObra", ObraController.getById);
obraRouter.post("/", ObraController.create);
obraRouter.post("/filtrar", ObraController.buscarConFiltros);
obraRouter.put("/:idObra", ObraController.update);
obraRouter.delete("/:idObra", ObraController.delete);

obraRouter.use(errorHandler);

export default obraRouter;

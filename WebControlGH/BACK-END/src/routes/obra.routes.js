import { ObraController } from "../controllers/obra.controller.js";
import { Router } from "express";
import { errorHandler } from "../middlewares/ErrorHandler.js";

export const obraRouter = Router();

obraRouter.get("/", ObraController.getAll);
obraRouter.get("/:idObra", ObraController.getById);
obraRouter.get("/buscar/descripcion", ObraController.getByDescripcion);
obraRouter.post("/", ObraController.create);
obraRouter.put("/:idObra", ObraController.update);
obraRouter.delete("/:idObra", ObraController.delete);

obraRouter.use(errorHandler);

export default obraRouter;

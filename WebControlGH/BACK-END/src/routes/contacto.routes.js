import { Router } from "express";
import { ContactoController } from "../controllers/contacto.controller.js";
import { errorHandler } from "../middlewares/ErrorHandler.js";

const contactoRouter = Router();

contactoRouter.get("/", ContactoController.getAll);
contactoRouter.post("/filtrar", ContactoController.buscarConFiltros);
contactoRouter.get("/:idEmpresa", ContactoController.getByEmpresa);
contactoRouter.post("/", ContactoController.create);

contactoRouter.use(errorHandler);

export default contactoRouter;

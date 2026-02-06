import { Router } from "express";
import { ContactoController } from "../controllers/contacto.controller.js";
import { errorHandler } from "../middlewares/ErrorHandler.js";

const contactoRouter = Router();

contactoRouter.get("/:idEmpresa", ContactoController.getByEmpresa);
contactoRouter.get("/", ContactoController.getAll);
contactoRouter.post("/", ContactoController.create)

contactoRouter.use(errorHandler);

export default contactoRouter;

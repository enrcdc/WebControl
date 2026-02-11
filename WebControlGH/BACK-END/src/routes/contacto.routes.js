import { Router } from "express";
import { ContactoController } from "../controllers/contacto.controller.js";

const contactoRouter = Router();

contactoRouter.get("/", ContactoController.getAll);
// TODO: Eliminar cuando el frontend use getAll(filters)
contactoRouter.get("/:idEmpresa", ContactoController.getByEmpresa);
contactoRouter.post("/", ContactoController.create);

export default contactoRouter;

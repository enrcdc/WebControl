import { Router } from "express";
import { ContactoController } from "../controllers/contactoController.mjs";
import { errorHandler } from "../middlewares/ErrorHandler.mjs";

const contactoRouter = Router();

contactoRouter.get("/:idEmpresa", ContactoController.getByEmpresa);
contactoRouter.get("/", ContactoController.getAll);
contactoRouter.post("/", ContactoController.create)

contactoRouter.use(errorHandler);

export default contactoRouter;

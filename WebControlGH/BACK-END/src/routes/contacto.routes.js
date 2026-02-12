import { Router } from "express";
import { ContactoController } from "../controllers/contacto.controller.js";
import { validate } from "../middlewares/validate.js";
import {
  createContactoSchema,
  updateContactoSchema,
} from "../validations/contactoValidator.js";

const contactoRouter = Router();

contactoRouter.get("/", ContactoController.getAll);
// TODO: Eliminar cuando el frontend use getAll(filters)
contactoRouter.get("/:idEmpresa", ContactoController.getByEmpresa);
contactoRouter.post(
  "/",
  validate(createContactoSchema),
  ContactoController.create,
);
contactoRouter.patch(
  "/:idContacto",
  validate(updateContactoSchema),
  ContactoController.update,
);
contactoRouter.delete("/", ContactoController.delete);

export default contactoRouter;

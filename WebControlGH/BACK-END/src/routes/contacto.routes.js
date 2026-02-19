import { Router } from "express";
import { ContactoController } from "../controllers/contacto.controller.js";
import { validate } from "../middlewares/validate.js";
import {
  createContactoSchema,
  updateContactoSchema,
} from "../validations/contactoValidator.js";

const contactoRouter = Router();

contactoRouter.get("/", ContactoController.getAll);
contactoRouter.get("/:idContacto", ContactoController.getById);
contactoRouter.post("/filtrar", ContactoController.filtrar);
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

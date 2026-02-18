import { Router } from "express";
import { EdificioController } from "../controllers/edificio.controller.js";
import { validate } from "../middlewares/validate.js";
import {
  createEdificioSchema,
  updateEdificioSchema,
} from "../validations/edificioValidator.js";

export const edificioRouter = Router();

edificioRouter.get("/", EdificioController.getAll);
edificioRouter.post(
  "/",
  validate(createEdificioSchema),
  EdificioController.create,
);
edificioRouter.patch(
  "/:idEdificio",
  validate(updateEdificioSchema),
  EdificioController.update,
);
// Los ids de las obras a dar de baja se obtienen del cuerpo
edificioRouter.delete("/", EdificioController.delete);

export default edificioRouter;

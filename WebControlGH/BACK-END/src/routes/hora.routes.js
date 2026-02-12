import { Router } from "express";
import { HoraController } from "../controllers/hora.controller.js";
import { validate } from "../middlewares/validate.js";
import { createHoraSchema } from "../validations/horaValidator.js";

export const horasRouter = Router();

horasRouter.get("/", HoraController.getAll);
horasRouter.post("/filtrar", HoraController.filtrar);
horasRouter.post("/", validate(createHoraSchema), HoraController.create);

export default horasRouter;

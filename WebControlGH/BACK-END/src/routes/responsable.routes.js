import { Router } from "express";
import { ResponsablesController } from "../controllers/responsable.controller.js";
import { errorHandler } from "../middlewares/ErrorHandler.js";

export const responsablesRouter = Router();

responsablesRouter.get(
  "/subordinados/:codigoResponsable",
  ResponsablesController.getSubordinados
);

responsablesRouter.use(errorHandler);

export default responsablesRouter;

import { Router } from "express";
import { ResponsableController } from "../controllers/responsable.controller.js";
import { errorHandler } from "../middlewares/ErrorHandler.js";

const responsablesRouter = Router();

responsablesRouter.get(
  "/subordinados/:codigoResponsable",
  ResponsableController.getSubordinados,
);

responsablesRouter.use(errorHandler);

export default responsablesRouter;

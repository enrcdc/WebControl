import { Router } from "express";
import { ResponsableController } from "../controllers/responsable.controller.js";

const responsablesRouter = Router();

responsablesRouter.get(
  "/subordinados/:codigoResponsable",
  ResponsableController.getSubordinados,
);

export default responsablesRouter;

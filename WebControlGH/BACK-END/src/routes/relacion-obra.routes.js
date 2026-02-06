import { Router } from "express";
import { errorHandler } from "../middlewares/ErrorHandler.js";
import { RelacionObrasController } from "../controllers/relacion-obra.controller.js";

export const relacionObrasRouter = Router();

relacionObrasRouter.get("/padre/:idObra", RelacionObrasController.getObraPadre);
relacionObrasRouter.get("/hijas/:idObra", RelacionObrasController.getObrasHijas);
relacionObrasRouter.post("/padre", RelacionObrasController.setObraPadre);
relacionObrasRouter.post("/hijas", RelacionObrasController.setObrasHijas);

relacionObrasRouter.use(errorHandler);

export default relacionObrasRouter;


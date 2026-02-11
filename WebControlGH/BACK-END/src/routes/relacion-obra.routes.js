import { Router } from "express";
import { RelacionObraController } from "../controllers/relacion-obra.controller.js";

const relacionObrasRouter = Router();

relacionObrasRouter.get("/padre/:idObra", RelacionObraController.getObraPadre);
relacionObrasRouter.get("/hijas/:idObra", RelacionObraController.getObrasHijas);
relacionObrasRouter.post("/padre", RelacionObraController.setObraPadre);
relacionObrasRouter.post("/hijas", RelacionObraController.setObrasHijas);

export default relacionObrasRouter;

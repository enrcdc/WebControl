import { Router } from "express";
import { FacturaObraController } from "../controllers/factura-obra.controller.js";

const facturaObraRouter = Router();

facturaObraRouter.get("/", FacturaObraController.getAll);
facturaObraRouter.post("/filtrar", FacturaObraController.filtrar);
facturaObraRouter.post("/", FacturaObraController.create);
facturaObraRouter.patch("/:idFactura", FacturaObraController.update);
facturaObraRouter.delete("/:idFactura", FacturaObraController.delete);

export default facturaObraRouter;

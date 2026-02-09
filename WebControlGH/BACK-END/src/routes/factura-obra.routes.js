import { Router } from "express";
import { FacturaObraController } from "../controllers/factura-obra.controller.js";
import { errorHandler } from "../middlewares/ErrorHandler.js";

const facturaObraRouter = Router();

facturaObraRouter.post("/buscar", FacturaObraController.getByObras);
facturaObraRouter.post("/", FacturaObraController.create);
facturaObraRouter.put("/:idFactura", FacturaObraController.update);
facturaObraRouter.delete("/:idFactura", FacturaObraController.delete);

facturaObraRouter.use(errorHandler);

export default facturaObraRouter;

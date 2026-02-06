import { Router } from "express";
import { EcoFacturaController } from "../controllers/eco-factura.controller.js";
import { errorHandler } from "../middlewares/ErrorHandler.js";

const ecoFacturasRouter = Router();

ecoFacturasRouter.post("/buscar", EcoFacturaController.getByObras);
ecoFacturasRouter.post("/", EcoFacturaController.create);
ecoFacturasRouter.put("/:idFactura", EcoFacturaController.update);
ecoFacturasRouter.delete("/:idFactura", EcoFacturaController.delete);

ecoFacturasRouter.use(errorHandler);

export default ecoFacturasRouter;

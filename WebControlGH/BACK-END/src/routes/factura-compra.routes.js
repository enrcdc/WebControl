import { Router } from "express";
import { FacturaCompraController } from "../controllers/factura-compra.controller.js";
import { errorHandler } from "../middlewares/ErrorHandler.js";

export const facturaCompraRouter = Router();

facturaCompraRouter.get("/", FacturaCompraController.getAll);
facturaCompraRouter.post("/filtrar", FacturaCompraController.buscarConFiltros);
facturaCompraRouter.get("/obra/:idObra", FacturaCompraController.getByObra);
facturaCompraRouter.get("/buscar/concepto", FacturaCompraController.getByConcepto);
facturaCompraRouter.get("/:id", FacturaCompraController.getById);
facturaCompraRouter.post("/", FacturaCompraController.create);
facturaCompraRouter.patch("/:id", FacturaCompraController.update);
facturaCompraRouter.delete("/:id", FacturaCompraController.delete);

facturaCompraRouter.use(errorHandler);

export default facturaCompraRouter;

import { Router } from "express";
import { FacturasController } from "../controllers/factura.controller.js";
import { errorHandler } from "../middlewares/ErrorHandler.js";

export const facturasRouter = Router();

facturasRouter.get("/", FacturasController.getAll);
facturasRouter.get("/obra/:idObra", FacturasController.getByObra); // Este endpoint no debería de ser así ya que no pertenece a obra, debería ser /:idObra
facturasRouter.get("/:id", FacturasController.getById);
facturasRouter.get("/buscar/concepto", FacturasController.getByConcepto); // Este endpoint no sigue las buenas prácticas de una API REST
facturasRouter.post("/", FacturasController.create);
facturasRouter.patch("/:id", FacturasController.update);
facturasRouter.delete("/:id", FacturasController.delete);

facturasRouter.use(errorHandler);

export default facturasRouter;
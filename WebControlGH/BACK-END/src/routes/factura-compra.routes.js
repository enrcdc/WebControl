import { Router } from "express";
import { FacturaCompraController } from "../controllers/factura-compra.controller.js";
import { validate } from "../middlewares/validate.js";
import {
  createFacturaSchema,
  updateFacturaSchema,
} from "../validations/facturasValidator.js";

export const facturaCompraRouter = Router();

facturaCompraRouter.get("/", FacturaCompraController.getAll);

facturaCompraRouter.get("/:id", FacturaCompraController.getById);

facturaCompraRouter.post(
  "/",
  validate(createFacturaSchema),
  FacturaCompraController.create,
);
facturaCompraRouter.patch(
  "/:id",
  validate(updateFacturaSchema),
  FacturaCompraController.update,
);
facturaCompraRouter.delete("/:id", FacturaCompraController.delete);

export default facturaCompraRouter;

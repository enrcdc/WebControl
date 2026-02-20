import { Router } from "express";
import { ProveedorController } from "../controllers/proveedor.controller.js";
import { validate } from "../middlewares/validate.js";
import {
  createProveedorSchema,
  updateProveedorSchema,
} from "../validations/proveedorValidator.js";

export const proveedorRouter = Router();

proveedorRouter.get("/", ProveedorController.getAll);
proveedorRouter.get("/ultimo-codigo", ProveedorController.getUltimoCodigo);
proveedorRouter.get("/:idProveedor", ProveedorController.getById);
proveedorRouter.post(
  "/",
  validate(createProveedorSchema),
  ProveedorController.create,
);
proveedorRouter.patch(
  "/:idProveedor",
  validate(updateProveedorSchema),
  ProveedorController.update,
);
// Los ids de las obras a dar de baja se obtienen del cuerpo
proveedorRouter.delete("/", ProveedorController.delete);

export default proveedorRouter;

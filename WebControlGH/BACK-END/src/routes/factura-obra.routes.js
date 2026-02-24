import { Router } from "express";
import { FacturaObraController } from "../controllers/factura-obra.controller.js";
import { validate } from "../middlewares/validate.js";
import { createFacturaObraSchema, updateFacturaObraSchema } from "../validations/facturaObraValidator.js";

const facturaObraRouter = Router();

facturaObraRouter.get("/", FacturaObraController.getAll);
facturaObraRouter.get("/:idFactura", FacturaObraController.getById);
facturaObraRouter.post("/filtrar", FacturaObraController.filtrar);
facturaObraRouter.post("/", validate(createFacturaObraSchema), FacturaObraController.create);
facturaObraRouter.patch("/:idFactura", validate(updateFacturaObraSchema), FacturaObraController.update);
facturaObraRouter.delete("/", FacturaObraController.deleteMany);
facturaObraRouter.delete("/:idFactura", FacturaObraController.delete);

export default facturaObraRouter;

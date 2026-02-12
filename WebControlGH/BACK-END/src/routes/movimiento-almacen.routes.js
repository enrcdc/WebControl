import { Router } from "express";
import { MovimientoAlmacenController } from "../controllers/movimiento-almacen.controller.js";
import { validate } from "../middlewares/validate.js";
import { createMovimientoAlmacenSchema, updateMovimientoAlmacenSchema } from "../validations/movimientoAlmacenValidator.js";

const movimientosAlmacenRouter = Router();

movimientosAlmacenRouter.get("/", MovimientoAlmacenController.getAll);
movimientosAlmacenRouter.post("/", validate(createMovimientoAlmacenSchema), MovimientoAlmacenController.create);
movimientosAlmacenRouter.patch("/:idMovimiento", validate(updateMovimientoAlmacenSchema), MovimientoAlmacenController.update);
movimientosAlmacenRouter.delete("/:idMovimiento", MovimientoAlmacenController.delete);

export default movimientosAlmacenRouter;

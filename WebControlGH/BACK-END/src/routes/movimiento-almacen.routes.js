import { Router } from "express";
import { MovimientoAlmacenController } from "../controllers/movimiento-almacen.controller.js";

const movimientosAlmacenRouter = Router();

movimientosAlmacenRouter.get("/", MovimientoAlmacenController.getAll);
movimientosAlmacenRouter.post("/", MovimientoAlmacenController.create);
movimientosAlmacenRouter.patch("/:idMovimiento", MovimientoAlmacenController.update);
movimientosAlmacenRouter.delete("/:idMovimiento", MovimientoAlmacenController.delete);

export default movimientosAlmacenRouter;

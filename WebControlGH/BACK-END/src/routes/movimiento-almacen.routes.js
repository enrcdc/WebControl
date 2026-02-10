import { Router } from "express";
import { MovimientoAlmacenController } from "../controllers/movimiento-almacen.controller.js";
import { errorHandler } from "../middlewares/ErrorHandler.js";

const movimientosAlmacenRouter = Router();

movimientosAlmacenRouter.post("/filtrar", MovimientoAlmacenController.buscarConFiltros);
movimientosAlmacenRouter.get("/obra/:idObra", MovimientoAlmacenController.getByObra);
movimientosAlmacenRouter.post("/", MovimientoAlmacenController.create);
movimientosAlmacenRouter.patch("/:idMovimiento", MovimientoAlmacenController.update);
movimientosAlmacenRouter.delete("/:idMovimiento", MovimientoAlmacenController.delete);

movimientosAlmacenRouter.use(errorHandler);

export default movimientosAlmacenRouter;

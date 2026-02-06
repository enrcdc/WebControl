import Router from 'express';
import { MovimientosAlmacenController } from '../controllers/movimiento-almacen.controller.js';
import { errorHandler } from '../middlewares/ErrorHandler.js';

const movimientosAlmacenRouter = Router();

movimientosAlmacenRouter.get('/obra/:idObra', MovimientosAlmacenController.getByObra);
movimientosAlmacenRouter.post('/', MovimientosAlmacenController.create);
movimientosAlmacenRouter.put('/:idMovimiento', MovimientosAlmacenController.update);
movimientosAlmacenRouter.delete('/:idMovimiento', MovimientosAlmacenController.delete);

movimientosAlmacenRouter.use(errorHandler);

export default movimientosAlmacenRouter;
import { MovimientoAlmacenService } from "../services/movimiento-almacen.service.js";

export class MovimientoAlmacenController {
  static async getByObra(req, res, next) {
    try {
      const { idObra } = req.params;
      const movimientos = await MovimientoAlmacenService.getByObra(idObra);
      res.json({ success: true, data: movimientos });
    } catch (error) {
      next(error);
    }
  }

  static async create(req, res, next) {
    try {
      const movimientoData = req.body;
      const nuevoMovimiento =
        await MovimientoAlmacenService.create(movimientoData);
      res.status(201).json({ success: true, data: nuevoMovimiento });
    } catch (error) {
      next(error);
    }
  }

  static async update(req, res, next) {
    try {
      const { idMovimiento } = req.params;
      const updateData = req.body;
      const movimientoActualizado = await MovimientoAlmacenService.update(
        idMovimiento,
        updateData,
      );
      res.json({ success: true, data: movimientoActualizado });
    } catch (error) {
      next(error);
    }
  }

  static async delete(req, res, next) {
    try {
      const { idMovimiento } = req.params;
      const { codigoUsuarioBaja } = req.body;
      const movimientoEliminado = await MovimientoAlmacenService.delete(
        idMovimiento,
        codigoUsuarioBaja,
      );
      res.json({ success: true, data: movimientoEliminado });
    } catch (error) {
      next(error);
    }
  }

  static async buscarConFiltros(req, res, next) {
    try {
      const filtros = req.body;
      const movimientos =
        await MovimientoAlmacenService.buscarConFiltros(filtros);
      res.status(200).json({
        success: true,
        data: movimientos,
        count: movimientos.length,
        filtros: filtros,
      });
    } catch (error) {
      next(error);
    }
  }
}

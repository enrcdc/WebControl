import { MovimientoAlmacenService } from "../services/movimiento-almacen.service.js";

export class MovimientoAlmacenController {
  static async getAll(req, res, next) {
    try {
      const filters = req.query;
      const result = await MovimientoAlmacenService.getAll(filters);
      res.json({ success: true, ...result });
    } catch (error) {
      next(error);
    }
  }

  static async create(req, res, next) {
    try {
      const movimientoData = req.body;
      const nuevoMovimiento =
        await MovimientoAlmacenService.create(movimientoData);
      res.status(201).json({
        success: true,
        message: "Movimiento creado exitosamente",
        data: nuevoMovimiento,
      });
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
      res.json({
        success: true,
        message: "Movimiento actualizado exitosamente",
        data: movimientoActualizado,
      });
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
      res.json({
        success: true,
        message: "Movimiento eliminado exitosamente",
        data: movimientoEliminado,
      });
    } catch (error) {
      next(error);
    }
  }
}

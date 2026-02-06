import { MovimientosAlmacenModel } from "../models/movimiento-almacen.model.js";

export class MovimientosAlmacenController {
  static async getByObra(req, res, next) {
    try {
      const { idObra } = req.params;
      const movimientos = await MovimientosAlmacenModel.getByObra({
        idObra: Number(idObra),
      });
      res.json({ success: true, data: movimientos });
    } catch (error) {
      next(error);
    }
  }

  static async create(req, res, next) {
    try {
      const input = req.body;
      const nuevoMovimiento = await MovimientosAlmacenModel.create({ input });
      res.status(201).json({ success: true, data: nuevoMovimiento });
    } catch (error) {
      next(error);
    }
  }

  static async update(req, res, next) {
    try {
      const { idMovimiento } = req.params;
      const input = req.body;
      const movimientoActualizado = await MovimientosAlmacenModel.update({
        idMovimiento: Number(idMovimiento),
        input,
      });
      if (!movimientoActualizado) {
        const error = new Error("Movimiento no encontrado o actualizado");
        error.name = "NotFoundError";
        throw error;
      }
      res.json({ success: true, data: movimientoActualizado });
    } catch (error) {
      next(error);
    }
  }

  static async delete(req, res, next) {
    try {
      const { idMovimiento } = req.params;
      const { codigoUsuarioBaja } = req.body;

      const movimientoEliminado = await MovimientosAlmacenModel.delete({
        idMovimiento: Number(idMovimiento),
        codigoUsuarioBaja,
      });
      
      if (!movimientoEliminado) {
        const error = new Error("Movimiento no encontrado o ya eliminado");
        error.name = "NotFoundError";
        throw error;
      }
      res.json({ success: true, data: movimientoEliminado });
    } catch (error) {
      next(error);
    }
  }
}

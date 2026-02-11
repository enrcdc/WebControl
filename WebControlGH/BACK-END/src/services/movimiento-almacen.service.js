import { MovimientoAlmacenModel } from "../models/movimiento-almacen.model.js";
import { NotFoundError, AlreadyDeletedError } from "../errors/index.js";
import { validateId, validateNotEmpty } from "../utils/index.js";

export class MovimientoAlmacenService {
  static async getAll(filters = {}) {
    const movimientos = await MovimientoAlmacenModel.getAll(filters);

    if (!movimientos || movimientos.length === 0) {
      throw new NotFoundError(
        "Movimientos",
        null,
        "No hay movimientos registrados en el sistema",
      );
    }

    return movimientos;
  }

  static async create(movimientoData) {
    validateNotEmpty(movimientoData, "datos del movimiento");

    const nuevoMovimiento = await MovimientoAlmacenModel.create({
      input: movimientoData,
    });

    if (!nuevoMovimiento) {
      throw new Error("Error al crear el movimiento");
    }

    return nuevoMovimiento;
  }

  static async update(id, updateData) {
    const validId = validateId(id, "ID de movimiento");
    validateNotEmpty(updateData, "datos de actualización");

    await this._getMovimientoOrFail(validId);

    const movimientoActualizado = await MovimientoAlmacenModel.update({
      id: validId,
      input: updateData,
    });

    if (!movimientoActualizado) {
      throw new NotFoundError("Movimiento de almacén", id);
    }

    return movimientoActualizado;
  }

  static async delete(id, codigoUsuarioBaja) {
    const validId = validateId(id, "ID de movimiento");

    const movimiento = await this._getMovimientoOrFail(validId, false);

    if (movimiento.fecha_baja) {
      throw new AlreadyDeletedError("Movimiento de almacén", id);
    }

    const movimientoEliminado = await MovimientoAlmacenModel.delete({
      id: validId,
      codigoUsuarioBaja,
    });

    if (!movimientoEliminado) {
      throw new NotFoundError("Movimiento de almacén", id);
    }

    return movimientoEliminado;
  }

  // ============================================
  // MÉTODOS PRIVADOS
  // ============================================

  static async _getMovimientoOrFail(id, checkDeleted = true) {
    const movimiento = await MovimientoAlmacenModel.getById({ id });

    if (!movimiento) {
      throw new NotFoundError("Movimiento de almacén", id);
    }

    if (checkDeleted && movimiento.fecha_baja) {
      throw new AlreadyDeletedError("Movimiento de almacén", id);
    }

    return movimiento;
  }
}

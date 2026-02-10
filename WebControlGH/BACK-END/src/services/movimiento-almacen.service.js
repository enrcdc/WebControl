import { MovimientoAlmacenModel } from "../models/movimiento-almacen.model.js";
import {
  NotFoundError,
  InvalidDataError,
  AlreadyDeletedError,
} from "../errors/index.js";
import { validateId, validateNotEmpty } from "../utils/index.js";

export class MovimientoAlmacenService {
  // TODO: Buscar con filtros ya hace la función de este método.
  static async getByObra(idObra) {
    const validId = validateId(idObra, "ID de obra");

    const movimientos = await MovimientoAlmacenModel.getByObra({
      idObra: validId,
    });
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

  static async buscarConFiltros(filtros) {
    if (!filtros.idObra) {
      throw new InvalidDataError(
        "Se necesita especificar el ID de obra para filtrar movimientos",
        { field: "idObra" },
      );
    }

    const validId = validateId(filtros.idObra, "ID de obra");
    let movimientos = await MovimientoAlmacenModel.getByObra({
      idObra: validId,
    });

    if (filtros.referencia) {
      movimientos = movimientos.filter(
        (m) => m.id_referencia === filtros.referencia,
      );
    }

    if (filtros.tipoMovimiento) {
      movimientos = movimientos.filter((m) =>
        m.tipo_movimiento
          ?.toLowerCase()
          .includes(filtros.tipoMovimiento.toLowerCase()),
      );
    }

    if (filtros.conceptoMovimiento) {
      movimientos = movimientos.filter((m) =>
        m.concepto_movimiento
          ?.toLowerCase()
          .includes(filtros.conceptoMovimiento.toLowerCase()),
      );
    }

    return movimientos;
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

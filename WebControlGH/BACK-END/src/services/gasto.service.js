import { GastoModel } from "../models/gasto.model.js";
import { NotFoundError, InvalidDataError } from "../errors/index.js";

export class GastoService {
  static async getAll(filters = {}) {
    const gastos = await GastoModel.getAll(filters);

    if (!gastos || gastos.length === 0) {
      throw new NotFoundError(
        "Gastos",
        null,
        "No hay gastos registrados en el sistema",
      );
    }

    return gastos;
  }

  // TODO: Eliminar cuando el frontend use getAll(filters)
  static async getGastosByObra(idsObra) {
    this._validateIdsObra(idsObra);
    return GastoModel.getGastosByObra({ idsObra });
  }

  // TODO: Eliminar cuando el frontend use getAll(filters)
  static async getHorasExtraByObra(idsObra) {
    this._validateIdsObra(idsObra);
    return GastoModel.getHorasExtraByObra({ idsObra });
  }

  // ============================================
  // MÉTODOS PRIVADOS
  // ============================================

  static _validateIdsObra(idsObra) {
    if (!Array.isArray(idsObra) || idsObra.length === 0) {
      throw new InvalidDataError("Se requiere al menos un ID de obra", {
        field: "idsObra",
      });
    }
  }
}

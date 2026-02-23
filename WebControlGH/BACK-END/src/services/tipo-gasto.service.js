import { TipoGastoModel } from "../models/tipo-gasto.js";
import { AlreadyDeletedError, NotFoundError } from "../errors/index.js";
import { validateNotEmpty, validateId } from "../utils/index.js";

export class TipoGastoService {
  static async getAll(filters = {}) {
    const { data, pagination } = await TipoGastoModel.getAll(filters);

    if (!data || data.length === 0) {
      throw new NotFoundError(
        "TiposGasto",
        null,
        "No hay tipos de gasto registrados en el sistema",
      );
    }

    return { data, pagination };
  }

  static async getById(idTipoGasto) {
    const validId = validateId(idTipoGasto, "ID de tipo de gasto");
    const tipoGasto = await TipoGastoModel.getById({ idTipoGasto: validId });

    if (!tipoGasto) {
      throw new NotFoundError("TipoGasto", idTipoGasto);
    }

    return tipoGasto;
  }

  static async create(data) {
    validateNotEmpty(data, "datos del tipo de gasto");

    const nuevoTipoGasto = await TipoGastoModel.create(data);

    if (!nuevoTipoGasto) {
      throw new Error("Error al crear el tipo de gasto");
    }

    return nuevoTipoGasto;
  }

  static async update(idTipoGasto, updateData) {
    const validId = validateId(idTipoGasto, "ID de tipo de gasto");
    validateNotEmpty(updateData, "datos de actualización");

    const tipoGastoExistente = await TipoGastoModel.getById({
      idTipoGasto: validId,
    });

    if (!tipoGastoExistente) {
      throw new NotFoundError("TipoGasto", idTipoGasto);
    }

    if (tipoGastoExistente.fecha_baja) {
      throw new AlreadyDeletedError("TipoGasto", idTipoGasto);
    }

    const tipoGastoActualizado = await TipoGastoModel.update({
      idTipoGasto: validId,
      input: updateData,
    });

    return tipoGastoActualizado;
  }

  static async delete(idsTipoGasto) {
    const validIDs = idsTipoGasto.map((id) => validateId(id));

    const resultado = { eliminados: [], yaEliminados: [], noEncontrados: [] };

    for (const id of validIDs) {
      const tipoGasto = await TipoGastoModel.getById({ idTipoGasto: id });

      if (!tipoGasto) {
        resultado.noEncontrados.push(id);
      } else if (tipoGasto.fecha_baja) {
        resultado.yaEliminados.push(id);
      } else {
        resultado.eliminados.push(id);
      }
    }

    if (resultado.eliminados.length > 0) {
      await TipoGastoModel.delete({ idsTipoGasto: resultado.eliminados });
    }

    return resultado;
  }
}

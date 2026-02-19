import { EdificioModel } from "../models/edificio.model.js";
import { NotFoundError, AlreadyDeletedError } from "../errors/index.js";
import { validateId, validateNotEmpty } from "../utils/index.js";

export class EdificioService {
  static async getAll(filters = {}) {
    const { data, pagination } = await EdificioModel.getAll(filters);

    /* TODO: Lo he comentado por que si no deja acceder a contactos sin edificios
    if (!data || data.length === 0) {
      throw new NotFoundError(
        "Complejos",
        null,
        "No hay complejos registrados en el sistema",
      );
    }*/

    return { data, pagination };
  }

  static async getById(id) {
    const validId = validateId(id, "ID de edificio");

    const edificio = await EdificioModel.getById({ idEdificio: validId });

    if (!edificio) {
      throw new NotFoundError("Edificio", id);
    }

    if (edificio.fecha_baja) {
      throw new AlreadyDeletedError("Edificio", id);
    }

    return edificio;
  }

  static async create(edificioData) {
    this._validateEdificioData(edificioData);

    const nuevoEdificio = await EdificioModel.create(edificioData);

    if (!nuevoEdificio) {
      throw new Error("Error al crear el complejo");
    }

    return nuevoEdificio;
  }

  static async update(idEdificio, updateData) {
    const validID = validateId(idEdificio, "ID de complejo");
    validateNotEmpty(updateData, "datos de actualización");

    await this._getEdificioOrFail(validID);

    const edificioActualizado = await EdificioModel.update({
      idEdificio: validID,
      input: updateData,
    });

    return edificioActualizado;
  }

  // TODO: Llevar esta misma lógica de borrado múltiple al resto de entidades.
  // El proceso lleva registro de aquellos no encontrados, de aquellos ya eliminados
  // y de aquellos eliminados durante la operación.
  static async delete(idEdificios) {
    const validIDs = idEdificios.map((id) => validateId(id));

    const resultado = { eliminados: [], yaEliminados: [], noEncontrados: [] };

    for (const id of validIDs) {
      const edificio = await EdificioModel.getById({ idEdificio: id });

      if (!edificio) {
        resultado.noEncontrados.push(id);
      } else if (edificio.fecha_baja) {
        resultado.yaEliminados.push(id);
      } else {
        resultado.eliminados.push(id);
      }
    }

    if (resultado.eliminados.length > 0) {
      await EdificioModel.delete({ idEdificios: resultado.eliminados });
    }

    return resultado;
  }

  // ============================================
  // MÉTODOS PRIVADOS
  // ============================================

  // TODO: Más validaciones de lógica de negocio
  static _validateEdificioData(data) {
    validateNotEmpty(data, "datos del complejo");
  }

  static async _getEdificioOrFail(id, checkDeleted = true) {
    const edificio = await EdificioModel.getById({ idEdificio: id });

    if (!edificio) {
      throw new NotFoundError("Complejo", id);
    }

    if (checkDeleted && edificio.fecha_baja) {
      throw new AlreadyDeletedError("Complejo", id);
    }

    return edificio;
  }
}

import { ContactoModel } from "../models/contacto.model.js";
import {
  NotFoundError,
  InvalidDataError,
  AlreadyDeletedError,
} from "../errors/index.js";
import { validateId, validateNotEmpty } from "../utils/index.js";

export class ContactoService {
  static async getAll(filters = {}) {
    const { data, pagination } = await ContactoModel.getAll(filters);
    return { data, pagination };
  }

  static async getById(id) {
    const validId = validateId(id, "ID de contacto");

    const contacto = await ContactoModel.getById({ idContacto: validId });

    if (!contacto) {
      throw new NotFoundError("Contacto", id);
    }

    if (contacto.fecha_baja) {
      throw new AlreadyDeletedError("Contacto", id);
    }

    return contacto;
  }

  static async create(contactoData) {
    this._validateContactoData(contactoData);

    const nuevoContacto = await ContactoModel.create(contactoData);

    if (!nuevoContacto) {
      throw new Error("Error al crear el contacto");
    }

    return nuevoContacto;
  }

  static async update(idContacto, updateData) {
    const validID = validateId(idContacto, "ID del contacto");
    validateNotEmpty(updateData, "datos de actualización");

    // No nos interesa saber si fue dado de baja o no porque puedo darle de alta otra vez
    await this._getContactoOrFail(validID, false);

    const contactoActualizado = await ContactoModel.update({
      idContacto: validID,
      input: updateData,
    });

    return contactoActualizado;
  }

  // El proceso lleva registro de aquellos no encontrados, de aquellos ya eliminados
  // y de aquellos eliminados durante la operación.
  static async delete(idContactos) {
    const validIDs = idContactos.map((id) => validateId(id));

    const resultado = { eliminados: [], yaEliminados: [], noEncontrados: [] };

    for (const id of validIDs) {
      const contacto = await ContactoModel.getById({ idContacto: id });

      if (!contacto) {
        resultado.noEncontrados.push(id);
      } else if (contacto.fecha_baja) {
        resultado.yaEliminados.push(id);
      } else {
        resultado.eliminados.push(id);
      }
    }

    if (resultado.eliminados.length > 0) {
      await ContactoModel.delete({ idContactos: resultado.eliminados });
    }

    return resultado;
  }

  // ============================================
  // MÉTODOS PRIVADOS
  // ============================================

  static async _getContactoOrFail(id, checkDeleted = true) {
    const contacto = await ContactoModel.getById({ idContacto: id });

    if (!contacto) throw new NotFoundError("Contacto", id);

    if (checkDeleted && contacto.fecha_baja) {
      throw new AlreadyDeletedError("Contacto", id);
    }

    return contacto;
  }

  static _validateContactoData(data) {
    validateNotEmpty(data, "datos del contacto");

    if (!data.nombre || data.nombre.trim().length === 0) {
      throw new InvalidDataError("El nombre del contacto es obligatorio", {
        field: "nombre",
      });
    }

    if (!data.empresa || !data.empresa.id) {
      throw new InvalidDataError(
        "La empresa asociada es obligatoria al crear un contacto",
        { field: "empresa" },
      );
    }
  }
}

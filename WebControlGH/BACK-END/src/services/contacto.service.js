import { ContactoModel } from "../models/contacto.model.js";
import { NotFoundError, InvalidDataError } from "../errors/index.js";
import { validateId, validateNotEmpty } from "../utils/index.js";

export class ContactoService {
  static async getAll(filters = {}) {
    const contactos = await ContactoModel.getAll(filters);

    if (!contactos || contactos.length === 0) {
      throw new NotFoundError(
        "Contactos",
        null,
        "No hay contactos registrados en el sistema",
      );
    }

    return contactos;
  }

  // TODO: Eliminar cuando el frontend use getAll(filters)
  static async getByEmpresa(idEmpresa) {
    const validId = validateId(idEmpresa, "ID de empresa");

    const contactos = await ContactoModel.getByEmpresa({ idEmpresa: validId });

    if (!contactos || contactos.length === 0) {
      throw new NotFoundError(
        "Contactos",
        null,
        `No se encontraron contactos para la empresa con ID ${validId}`,
      );
    }

    return contactos;
  }

  static async create(contactoData) {
    this._validateContactoData(contactoData);

    const nuevoContacto = await ContactoModel.create(contactoData);

    if (!nuevoContacto) {
      throw new Error("Error al crear el contacto");
    }

    return nuevoContacto;
  }

  // ============================================
  // MÉTODOS PRIVADOS
  // ============================================

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

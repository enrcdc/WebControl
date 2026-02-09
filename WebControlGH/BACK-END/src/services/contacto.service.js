import { ContactoModel } from "../models/contacto.model.js";
import { NotFoundError, InvalidDataError } from "../errors/index.js";
import { validateId, validateNotEmpty } from "../utils/index.js";

export class ContactoService {
  static async getAll() {
    const contactos = await ContactoModel.getAll();

    if (!contactos || contactos.length === 0) {
      throw new NotFoundError(
        "Contactos",
        null,
        "No hay contactos registrados en el sistema",
      );
    }

    return contactos;
  }

  // Este método debería desaparecer
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

  // TODO: De momento hay getByEmpresa, pero se pueden añadir más.
  // (Retirar getByEmpresa cuando ya no se necesite)
  static async buscarConFiltros(filtros) {
    let contactos = await this.getAll();
    console.log("filtros", filtros);

    if (filtros.nombre) {
      contactos = contactos.filter((c) =>
        c.nombre.toLowerCase().includes(filtros.nombre.toLowerCase()),
      );
    }

    if (filtros.apellido1) {
      contactos = contactos.filter((c) =>
        c.apellido1?.toLowerCase().includes(filtros.apellido1.toLowerCase()),
      );
    }

    if (filtros.empresa) {
      contactos = contactos.filter((c) =>
        c.nombre_empresa?.toLowerCase().includes(filtros.empresa.toLowerCase()),
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

import { EmpresaModel } from "../models/empresa.model.js";
import { NotFoundError } from "../errors/index.js";
import { validateAndSanitizeString, validateNotEmpty } from "../utils/index.js";

export class EmpresaService {
  static async getAll(filters = {}) {
    const empresas = await EmpresaModel.getAll(filters);

    if (!empresas || empresas.length === 0) {
      throw new NotFoundError(
        "Empresas",
        null,
        "No hay empresas registradas en el sistema",
      );
    }

    return empresas;
  }

  // TODO: Eliminar cuando el frontend use getAll(filters)
  static async getByNombre(nombre) {
    const sanitized = validateAndSanitizeString(nombre, "nombre de empresa", {
      minLength: 2,
    });

    const empresas = await EmpresaModel.getByNombre({ nombre: sanitized });

    if (!empresas || empresas.length === 0) {
      throw new NotFoundError(
        "Empresas",
        null,
        `No se encontraron empresas con el nombre "${sanitized}"`,
      );
    }

    return empresas;
  }

  static async create(empresaData) {
    this._validateEmpresaData(empresaData);

    const nuevaEmpresa = await EmpresaModel.create(empresaData);

    if (!nuevaEmpresa) {
      throw new Error("Error al crear la empresa");
    }

    return nuevaEmpresa;
  }

  // ============================================
  // MÉTODOS PRIVADOS
  // ============================================

  // TODO: Más validaciones de lógica de negocio
  static _validateEmpresaData(data) {
    validateNotEmpty(data, "datos de la empresa");
  }
}

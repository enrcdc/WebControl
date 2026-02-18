import { EmpresaModel } from "../models/empresa.model.js";
import { AlreadyDeletedError, NotFoundError } from "../errors/index.js";
import {
  validateAndSanitizeString,
  validateNotEmpty,
  validateId,
} from "../utils/index.js";

export class EmpresaService {
  static async getAll(filters = {}) {
    const { data, pagination } = await EmpresaModel.getAll(filters);

    if (!data || data.length === 0) {
      throw new NotFoundError(
        "Empresas",
        null,
        "No hay empresas registradas en el sistema",
      );
    }

    return { data, pagination };
  }

  static async getById(id) {
    const validId = validateId(id, "ID de empresa");

    const empresa = await EmpresaModel.getById({ idEmpresa: validId });

    if (!empresa) {
      throw new NotFoundError("Empresa", id);
    }

    if (empresa.fecha_baja) {
      throw new AlreadyDeletedError("Empresa", id);
    }

    return empresa;
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

  static async update(idEmpresa, updateData) {
    const validID = validateId(idEmpresa, "ID de empresa");
    validateNotEmpty(updateData, "datos de actualización");

    await this._getEmpresaOrFail(validID, false);

    const empresaActualizada = await EmpresaModel.update({
      idEmpresa: validID,
      input: updateData,
    });

    return empresaActualizada;
  }

  static async delete(idEmpresas) {
    const validIDs = idEmpresas.map((id) => validateId(id));

    const resultado = { eliminados: [], yaEliminados: [], noEncontrados: [] };

    for (const id of validIDs) {
      const empresa = await EmpresaModel.getById({ idEmpresa: id });

      if (!empresa) {
        resultado.noEncontrados.push(id);
      } else if (empresa.fecha_baja) {
        resultado.yaEliminados.push(id);
      } else {
        resultado.eliminados.push(id);
      }
    }

    if (resultado.eliminados.length > 0) {
      await EmpresaModel.delete({ idEmpresas: resultado.eliminados });
    }

    return resultado;
  }

  // ============================================
  // MÉTODOS PRIVADOS
  // ============================================

  // TODO: Más validaciones de lógica de negocio
  static _validateEmpresaData(data) {
    validateNotEmpty(data, "datos de la empresa");
  }

  static async _getEmpresaOrFail(id, checkDeleted = true) {
    const empresa = await EmpresaModel.getById({ idEmpresa: id });

    if (!empresa) {
      throw new NotFoundError("Empresa", id);
    }

    if (checkDeleted && empresa.fecha_baja) {
      throw new AlreadyDeletedError("Empresa", id);
    }

    return empresa;
  }
}

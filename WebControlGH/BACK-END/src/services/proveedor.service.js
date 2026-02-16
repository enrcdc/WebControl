import { ProveedorModel } from "../models/proveedor.model.js";
import { AlreadyDeletedError, NotFoundError } from "../errors/index.js";
import {
  validateNotEmpty,
  validateId,
} from "../utils/index.js";

export class ProveedorService {
  static async getAll(filters = {}) {
    const { data, pagination } = await ProveedorModel.getAll(filters);

    if (!data || data.length === 0) {
      throw new NotFoundError(
        "Proveedores",
        null,
        "No hay proveedores registrados en el sistema",
      );
    }

    return { data, pagination };
  }

  static async create(proveedorData) {
    this._validateProveedorData(proveedorData);

    const nuevoProveedor = await ProveedorModel.create(proveedorData);

    if (!nuevoProveedor) {
      throw new Error("Error al crear el proveedor");
    }

    return nuevoProveedor;
  }

  static async update(idProveedor, updateData) {
    const validID = validateId(idProveedor, "ID de proveedor");
    validateNotEmpty(updateData, "datos de actualización");

    await this._getProveedorOrFail(validID);

    const proveedorActualizado = await ProveedorModel.update({
      idProveedor: validID,
      input: updateData,
    });

    return proveedorActualizado;
  }

  static async delete(idProveedores) {
    const validIDs = idProveedores.map((id) => validateId(id));

    const resultado = { eliminados: [], yaEliminados: [], noEncontrados: [] };

    for (const id of validIDs) {
      const proveedor = await ProveedorModel.getById({ idProveedor: id });

      if (!proveedor) {
        resultado.noEncontrados.push(id);
      } else if (proveedor.fecha_baja) {
        resultado.yaEliminados.push(id);
      } else {
        resultado.eliminados.push(id);
      }
    }

    if (resultado.eliminados.length > 0) {
      await ProveedorModel.delete({ idProveedores: resultado.eliminados });
    }

    return resultado;
  }

  // ============================================
  // MÉTODOS PRIVADOS
  // ============================================

  // TODO: Más validaciones de lógica de negocio
  static _validateProveedorData(data) {
    validateNotEmpty(data, "datos de la empresa");
  }

  static async _getProveedorOrFail(id, checkDeleted = true) {
    const proveedor = await ProveedorModel.getById({ idProveedor: id });

    if (!proveedor) {
      throw new NotFoundError("Proveedor", id);
    }

    if (checkDeleted && proveedor.fecha_baja) {
      throw new AlreadyDeletedError("Proveedor", id);
    }

    return proveedor;
  }
}

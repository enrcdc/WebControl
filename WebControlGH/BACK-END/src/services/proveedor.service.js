import { ProveedorModel } from "../models/proveedor.model.js";
import { AlreadyDeletedError, NotFoundError } from "../errors/index.js";
import { validateNotEmpty, validateId } from "../utils/index.js";
import { FDContactoSyncService } from "../integrations/FacturaDirecta/Contactos/FDContactoSyncService.js";

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

  static async getById(idProveedor) {
    const validID = validateId(idProveedor, "ID de proveedor");
    const proveedor = await ProveedorModel.getById({ idProveedor: validID });

    if (!proveedor) {
      throw new NotFoundError("Proveedor", idProveedor);
    }

    return proveedor;
  }

  static async getUltimoCodigo() {
    const [row] = await ProveedorModel.getLastCodigo();
    const ultimo = row?.ultimo_codigo ?? 0;
    return { siguienteCodigo: ultimo + 1 };
  }

  static async create(proveedorData) {
    this._validateProveedorData(proveedorData);

    const nuevoProveedor = await ProveedorModel.create(proveedorData);

    if (!nuevoProveedor) {
      throw new Error("Error al crear el proveedor");
    }

    // FD Sync — entityId del proveedor recién creado como id de persons
    const fdSync = await FDContactoSyncService.syncProveedor(
      proveedorData,
      nuevoProveedor.id,
      null,
    );
    if (fdSync.ok && fdSync.fdContactId) {
      console.log("Creación de proveedor satisfactoria");
      await ProveedorModel.saveFdContactId(
        nuevoProveedor.id,
        fdSync.fdContactId,
      );
    }

    return { ...nuevoProveedor, fdSync };
  }

  static async update(idProveedor, updateData) {
    const validID = validateId(idProveedor, "ID de proveedor");
    validateNotEmpty(updateData, "datos de actualización");

    const proveedorExistente = await this._getProveedorOrFail(validID);

    const proveedorActualizado = await ProveedorModel.update({
      idProveedor: validID,
      input: updateData,
    });

    // FD Sync
    const fdSync = await FDContactoSyncService.syncProveedor(
      updateData,
      validID,
      proveedorExistente.fd_contact_id ?? null,
    );
    if (fdSync.ok && fdSync.fdContactId) {
      await ProveedorModel.saveFdContactId(validID, fdSync.fdContactId);
    }

    return { ...proveedorActualizado, fdSync };
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

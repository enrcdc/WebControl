import { EmpresaModel } from "../models/empresa.model.js";
import { AlreadyDeletedError, NotFoundError } from "../errors/index.js";
import { validateNotEmpty, validateId } from "../utils/index.js";
import { FDContactoSyncService } from "../integrations/FacturaDirecta/Contactos/FDContactoSyncService.js";

// JSON_ARRAYAGG puede devolver string o array dependiendo del driver/versión
const parseContactos = (val) => {
  if (!val) return [];
  if (typeof val === "string") {
    try {
      return JSON.parse(val);
    } catch {
      return [];
    }
  }
  return Array.isArray(val) ? val : [];
};

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

  static async create(empresaData) {
    this._validateEmpresaData(empresaData);

    // create() devuelve getById() internamente → id normalizado + contactos incluidos
    const nuevaEmpresa = await EmpresaModel.create(empresaData);

    if (!nuevaEmpresa) {
      throw new Error("Error al crear la empresa");
    }

    const contactos = parseContactos(nuevaEmpresa.contactos);
    const fdSync = await FDContactoSyncService.syncEmpresa(
      empresaData,
      contactos,
      null,
    );
    if (fdSync.ok && fdSync.fdContactId) {
      await EmpresaModel.saveFdContactId(nuevaEmpresa.id, fdSync.fdContactId);
    }
    return { data: nuevaEmpresa, sync: fdSync };
  }

  static async update(idEmpresa, updateData) {
    const validID = validateId(idEmpresa, "ID de empresa");
    validateNotEmpty(updateData, "datos de actualización");

    const empresaExistente = await this._getEmpresaOrFail(validID, false);

    const empresaActualizada = await EmpresaModel.update({
      idEmpresa: validID,
      input: updateData,
    });

    // FD Sync — refetch para obtener contactos actualizados
    const empresaCompleta = await EmpresaModel.getById({ idEmpresa: validID });
    const contactos = parseContactos(empresaCompleta?.contactos);
    const fdSync = await FDContactoSyncService.syncEmpresa(
      updateData,
      contactos,
      empresaExistente.fd_contact_id ?? null,
    );
    if (fdSync.ok && fdSync.fdContactId) {
      await EmpresaModel.saveFdContactId(validID, fdSync.fdContactId);
    }

    return { data: empresaActualizada, sync: fdSync };
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

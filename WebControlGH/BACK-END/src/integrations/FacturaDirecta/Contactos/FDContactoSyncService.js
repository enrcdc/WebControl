import { contactoFDService } from "./ContactoService.js";
import { mapEmpresaToFD, mapProveedorToFD } from "./contacto.mapper.js";

/**
 * Servicio de sincronización ERP ↔ FacturaDirecta para contactos.
 *
 * Siempre devuelve un objeto de resultado — nunca lanza excepción —
 * para que el ERP no falle si FD no está disponible:
 *
 *   { ok: true,  fdContactId: "con_...", skipped?: true }   → éxito o saltado (sin CIF)
 *   { ok: false, error: "mensaje" }                         → FD falló, ERP continúa
 *
 * El fdContactId se persiste en la DB para hacer PUT en futuros updates.
 *
 * TODO: Sincronización de baja (soft delete ERP ↔ delete FD). Pendiente de
 *       decisión del cliente sobre cómo compatibilizar ambas plataformas.
 */
export class FDContactoSyncService {
  /**
   * Sincroniza una empresa ERP como contacto cliente en FacturaDirecta.
   *
   * @param {Object}      empresaData  - Datos camelCase de la empresa
   * @param {Array}       contactos    - Contactos relacionales de la empresa
   * @param {string|null} fdContactId  - ID FD existente (null → creación)
   */
  static async syncEmpresa(empresaData, contactos, fdContactId) {
    if (!empresaData.cif) return { ok: true, skipped: true };

    try {
      const payload = mapEmpresaToFD(empresaData, contactos);

      const result = fdContactId
        ? await contactoFDService.updateContacto(fdContactId, payload)
        : await contactoFDService.createContacto(payload);

      // FD devuelve el id en result.data.id o result.data.content.id
      const newFdContactId =
        result.data?.id ?? result.data?.content?.id ?? fdContactId;

      return { ok: true, fdContactId: newFdContactId };
    } catch (err) {
      const error =
        err.response?.data?.message ?? err.message ?? "Error desconocido";
      console.error("[FD Sync] Error sincronizando empresa:", error);
      return { ok: false, error };
    }
  }

  /**
   * Sincroniza un proveedor ERP como contacto proveedor en FacturaDirecta.
   *
   * @param {Object}      proveedorData - Datos camelCase del proveedor
   * @param {number}      entityId      - ID del proveedor en la DB (para persons)
   * @param {string|null} fdContactId   - ID FD existente (null → creación)
   */
  static async syncProveedor(proveedorData, entityId, fdContactId) {
    if (!proveedorData.cif) return { ok: true, skipped: true };

    try {
      const payload = mapProveedorToFD(proveedorData, entityId);

      const result = fdContactId
        ? await contactoFDService.updateContacto(fdContactId, payload)
        : await contactoFDService.createContacto(payload);

      const newFdContactId =
        result.data?.id ?? result.data?.content?.id ?? fdContactId;

      return { ok: true, fdContactId: newFdContactId };
    } catch (err) {
      const error =
        err.response?.data?.message ?? err.message ?? "Error desconocido";
      console.error("[FD Sync] Error sincronizando proveedor:", error);
      return { ok: false, error };
    }
  }
}

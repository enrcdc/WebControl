import { FacturaCompraModel } from "../models/factura-compra.model.js";
import {
  NotFoundError,
  InvalidDataError,
  AlreadyDeletedError,
} from "../errors/index.js";
import { validateId, validateNotEmpty } from "../utils/index.js";

export class FacturaCompraService {
  static async getAll(filters = {}) {
    const { data, pagination } = await FacturaCompraModel.getAll(filters);

    if (!data || data.length === 0) {
      throw new NotFoundError(
        "Facturas",
        null,
        "No hay facturas registradas en el sistema",
      );
    }

    return { data, pagination };
  }

  static async getById(id) {
    const validId = validateId(id, "ID de factura");

    const factura = await FacturaCompraModel.getById({ id: validId });

    if (!factura) {
      throw new NotFoundError("Factura", id);
    }

    if (factura.fecha_baja) {
      throw new AlreadyDeletedError("Factura", id);
    }

    return factura;
  }

  // TODO: Eliminar cuando el frontend use getAll(filters)
  static async getByObra(idObra) {
    const validId = validateId(idObra, "ID de obra");
    return FacturaCompraModel.getByObra({ idObra: validId });
  }

  // TODO: Eliminar cuando el frontend use getAll(filters)
  static async getByConcepto(concepto) {
    if (!concepto || concepto.trim().length === 0) {
      throw new InvalidDataError("El concepto de búsqueda es obligatorio", {
        field: "concepto",
      });
    }

    const facturas = await FacturaCompraModel.getByConcepto({ concepto });

    if (!facturas || facturas.length === 0) {
      throw new NotFoundError(
        "Facturas",
        null,
        `No se encontraron facturas con el concepto "${concepto}"`,
      );
    }

    return facturas;
  }

  static async create(facturaData) {
    validateNotEmpty(facturaData, "datos de la factura");

    const nuevaFactura = await FacturaCompraModel.create({
      input: facturaData,
    });

    if (!nuevaFactura) {
      throw new Error("Error al crear la factura");
    }

    return nuevaFactura;
  }

  static async update(id, updateData) {
    const validId = validateId(id, "ID de factura");
    validateNotEmpty(updateData, "datos de actualización");

    await this._getFacturaOrFail(validId);

    const facturaActualizada = await FacturaCompraModel.update({
      id: validId,
      input: updateData,
    });

    if (!facturaActualizada) {
      throw new NotFoundError("Factura", id);
    }

    return facturaActualizada;
  }

  static async delete(id, codigoUsuarioBaja) {
    const validId = validateId(id, "ID de factura");

    if (!codigoUsuarioBaja) {
      throw new InvalidDataError(
        "El código de usuario de baja es obligatorio para eliminar",
        { field: "codigoUsuarioBaja" },
      );
    }

    const factura = await this._getFacturaOrFail(validId, false);

    if (factura.fecha_baja) {
      throw new AlreadyDeletedError("Factura", id);
    }

    const facturaEliminada = await FacturaCompraModel.delete({
      id: validId,
      codigoUsuarioBaja,
    });

    if (!facturaEliminada) {
      throw new NotFoundError("Factura", id);
    }

    return facturaEliminada;
  }

  // ============================================
  // MÉTODOS PRIVADOS
  // ============================================

  static async _getFacturaOrFail(id, checkDeleted = true) {
    const factura = await FacturaCompraModel.getById({ id });

    if (!factura) {
      throw new NotFoundError("Factura", id);
    }

    if (checkDeleted && factura.fecha_baja) {
      throw new AlreadyDeletedError("Factura", id);
    }

    return factura;
  }
}

import { FacturaObraModel } from "../models/factura-obra.model.js";
import {
  NotFoundError,
  AlreadyDeletedError,
} from "../errors/index.js";
import { validateId, validateNotEmpty } from "../utils/index.js";

export class FacturaObraService {
  static async getAll(filters = {}) {
    const facturas = await FacturaObraModel.getAll(filters);

    if (!facturas || facturas.length === 0) {
      throw new NotFoundError(
        "Facturas de obra",
        null,
        "No hay facturas de obra registradas en el sistema",
      );
    }

    return facturas;
  }

  static async create(facturaData) {
    validateNotEmpty(facturaData, "datos de la factura");

    const nuevaFactura = await FacturaObraModel.create({ input: facturaData });

    if (!nuevaFactura) {
      throw new Error("Error al crear la factura");
    }

    return nuevaFactura;
  }

  static async update(idFactura, updateData) {
    const validId = validateId(idFactura, "ID de factura");
    validateNotEmpty(updateData, "datos de actualización");

    await this._getFacturaOrFail(validId);

    const facturaActualizada = await FacturaObraModel.update({
      idFactura: validId,
      input: updateData,
    });

    if (!facturaActualizada) {
      throw new NotFoundError("Factura de obra", idFactura);
    }

    return facturaActualizada;
  }

  static async delete(idFactura, codigoUsuarioBaja) {
    const validId = validateId(idFactura, "ID de factura");

    const factura = await this._getFacturaOrFail(validId, false);

    if (factura.fecha_baja) {
      throw new AlreadyDeletedError("Factura de obra", idFactura);
    }

    const facturaEliminada = await FacturaObraModel.delete({
      idFactura: validId,
      codigoUsuarioBaja,
    });

    if (!facturaEliminada) {
      throw new NotFoundError("Factura de obra", idFactura);
    }

    return facturaEliminada;
  }

  // ============================================
  // MÉTODOS PRIVADOS
  // ============================================

  static async _getFacturaOrFail(id, checkDeleted = true) {
    const factura = await FacturaObraModel.getById({ id });

    if (!factura) {
      throw new NotFoundError("Factura de obra", id);
    }

    if (checkDeleted && factura.fecha_baja) {
      throw new AlreadyDeletedError("Factura de obra", id);
    }

    return factura;
  }
}

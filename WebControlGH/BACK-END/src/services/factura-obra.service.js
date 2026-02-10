import { FacturaObraModel } from "../models/factura-obra.model.js";
import {
  NotFoundError,
  InvalidDataError,
  AlreadyDeletedError,
} from "../errors/index.js";
import { validateId, validateNotEmpty } from "../utils/index.js";

export class FacturaObraService {
  // TODO: Este debería ser sustituido por el de búsqueda por filtros
  static async getByObras(idsObras) {
    this._validateIdsObras(idsObras);

    const facturas = await FacturaObraModel.getByObras({ idsObras });
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

  static async buscarConFiltros(filtros) {
    let facturas = [];

    if (filtros.idsObras) {
      this._validateIdsObras(filtros.idsObras);
      facturas = await FacturaObraModel.getByObras({
        idsObras: filtros.idsObras,
      });
    } else {
      throw new InvalidDataError(
        "Se necesita especificar los IDs de obra para filtrar facturas",
        { field: "idsObras" },
      );
    }

    if (filtros.codigoFactura) {
      facturas = facturas.filter((f) =>
        f.codigo_factura
          ?.toLowerCase()
          .includes(filtros.codigoFactura.toLowerCase()),
      );
    }

    if (filtros.conceptoLinea) {
      facturas = facturas.filter((f) =>
        f.concepto_linea
          ?.toLowerCase()
          .includes(filtros.conceptoLinea.toLowerCase()),
      );
    }

    if (filtros.conceptoFactura) {
      facturas = facturas.filter((f) =>
        f.concepto_factura
          ?.toLowerCase()
          .includes(filtros.conceptoFactura.toLowerCase()),
      );
    }

    if (filtros.codigoPedido) {
      facturas = facturas.filter((f) =>
        f.codigo_pedido
          ?.toLowerCase()
          .includes(filtros.codigoPedido.toLowerCase()),
      );
    }

    return facturas;
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

  static _validateIdsObras(idsObras) {
    if (!Array.isArray(idsObras) || idsObras.length === 0) {
      throw new InvalidDataError("Se requiere al menos un ID de obra", {
        field: "idsObras",
      });
    }
  }
}

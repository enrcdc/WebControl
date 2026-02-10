import { PedidoObraModel } from "../models/pedido-obra.model.js";
import {
  NotFoundError,
  InvalidDataError,
  AlreadyDeletedError,
} from "../errors/index.js";
import { validateId, validateNotEmpty } from "../utils/index.js";

export class PedidoObraService {
  // TODO: Este debería ser sustituido por el de búsqueda por filtros
  static async getByObras(idsObras) {
    this._validateIdsObras(idsObras);

    const pedidos = await PedidoObraModel.getByObras({ idsObras });
    return pedidos;
  }

  static async create(pedidoData) {
    validateNotEmpty(pedidoData, "datos del pedido");

    const nuevoPedido = await PedidoObraModel.create({ input: pedidoData });

    if (!nuevoPedido) {
      throw new Error("Error al crear el pedido");
    }

    return nuevoPedido;
  }

  static async update(idPedido, updateData) {
    const validId = validateId(idPedido, "ID de pedido");
    validateNotEmpty(updateData, "datos de actualización");

    await this._getPedidoOrFail(validId);

    const pedidoActualizado = await PedidoObraModel.update({
      idPedido: validId,
      input: updateData,
    });

    if (!pedidoActualizado) {
      throw new NotFoundError("Pedido", idPedido);
    }

    return pedidoActualizado;
  }

  static async delete(idPedido, codigoUsuarioBaja) {
    const validId = validateId(idPedido, "ID de pedido");

    const pedido = await this._getPedidoOrFail(validId, false);

    if (pedido.fecha_baja) {
      throw new AlreadyDeletedError("Pedido", idPedido);
    }

    const pedidoEliminado = await PedidoObraModel.delete({
      idPedido: validId,
      codigoUsuarioBaja,
    });

    if (!pedidoEliminado) {
      throw new NotFoundError("Pedido", idPedido);
    }

    return pedidoEliminado;
  }

  static async buscarConFiltros(filtros) {
    let pedidos = [];

    if (filtros.idsObras) {
      this._validateIdsObras(filtros.idsObras);
      pedidos = await PedidoObraModel.getByObras({ idsObras: filtros.idsObras });
    } else {
      throw new InvalidDataError(
        "Se necesita especificar los IDs de obra para filtrar pedidos",
        { field: "idsObras" },
      );
    }

    if (filtros.codigoPedido) {
      pedidos = pedidos.filter((p) =>
        p.codigo_pedido
          ?.toLowerCase()
          .includes(filtros.codigoPedido.toLowerCase()),
      );
    }

    if (filtros.posicion) {
      pedidos = pedidos.filter((p) =>
        p.posicion?.toLowerCase().includes(filtros.posicion.toLowerCase()),
      );
    }

    if (filtros.observaciones) {
      pedidos = pedidos.filter((p) =>
        p.observaciones
          ?.toLowerCase()
          .includes(filtros.observaciones.toLowerCase()),
      );
    }

    return pedidos;
  }

  // ============================================
  // MÉTODOS PRIVADOS
  // ============================================

  static async _getPedidoOrFail(id, checkDeleted = true) {
    const pedido = await PedidoObraModel.getById({ id });

    if (!pedido) {
      throw new NotFoundError("Pedido", id);
    }

    if (checkDeleted && pedido.fecha_baja) {
      throw new AlreadyDeletedError("Pedido", id);
    }

    return pedido;
  }

  static _validateIdsObras(idsObras) {
    if (!Array.isArray(idsObras) || idsObras.length === 0) {
      throw new InvalidDataError("Se requiere al menos un ID de obra", {
        field: "idsObras",
      });
    }
  }
}

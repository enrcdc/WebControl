import { PedidoObraModel } from "../models/pedido-obra.model.js";
import { NotFoundError, AlreadyDeletedError } from "../errors/index.js";
import { validateId, validateNotEmpty } from "../utils/index.js";

export class PedidoObraService {
  static async getAll(filters = {}) {
    const { data, pagination } = await PedidoObraModel.getAll(filters);

    if (!data || data.length === 0) {
      throw new NotFoundError(
        "Pedidos",
        null,
        "No hay pedidos registrados en el sistema",
      );
    }

    return { data, pagination };
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

  // ============================================
  // MÉTODOS PRIVADOS
  // ============================================

  static async _getPedidoOrFail(id, checkDeleted = true) {
    const pedido = await PedidoObraModel.getById({ idPedido: id });

    if (!pedido) {
      throw new NotFoundError("Pedido", id);
    }

    if (checkDeleted && pedido.fecha_baja) {
      throw new AlreadyDeletedError("Pedido", id);
    }

    return pedido;
  }
}

import { EcoPedidoModel } from "../models/eco-pedido.model.js";

export class EcoPedidoController {
  static async getByObras(req, res, next) {
    try {
      const { idsObras } = req.body;
      if (!Array.isArray(idsObras) || idsObras.length === 0) {
        return res.json({ success: true, data: [] });
      }
      const pedidos = await EcoPedidoModel.getByObras({ idsObras });
      res.json({ success: true, data: pedidos });
    } catch (error) {
      next(error);
    }
  }

  static async create(req, res, next) {
    try {
      const input = req.body;
      const nuevoPedido = await EcoPedidoModel.create({ input });
      res.status(201).json({ success: true, data: nuevoPedido });
    } catch (error) {
      next(error);
    }
  }

  static async update(req, res, next) {
    try {
      const { idPedido } = req.params;
      const input = req.body;
      const pedidoActualizado = await EcoPedidoModel.update({
        idPedido: Number(idPedido),
        input,
      });

      if (!pedidoActualizado) {
        const error = new Error("Pedido no encontradao o actualizado");
        error.name = "NotFoundError";
        throw error;
      }
      res.json({ success: true, data: pedidoActualizado });
    } catch (error) {
      next(error);
    }
  }

  static async delete(req, res, next) {
    try {
      const { idPedido } = req.params;
      const { codigoUsuarioBaja } = req.body;

      /* 
      if (!codigoUsuarioBaja) {
        const error = new Error("codigoUsuarioBaja es requerido para eliminar");
        error.name = "ValidationError";
        throw error;
      }
      */

      const pedidoEliminado = await EcoPedidoModel.delete({
        idPedido: Number(idPedido),
        codigoUsuarioBaja,
      });

      if (!pedidoEliminado) {
        const error = new Error("Pedido no encontrado o ya eliminado");
        error.name = "NotFoundError";
        throw error;
      }
      res.json({ success: true, data: pedidoEliminado });
    } catch (error) {
      next(error);
    }
  }
}

import { PedidoObraService } from "../services/pedido-obra.service.js";

export class PedidoObraController {
  static async getAll(req, res, next) {
    try {
      const filters = req.query;
      const pedidos = await PedidoObraService.getAll(filters);
      res.json({
        success: true,
        data: pedidos,
        count: pedidos.length,
        filters,
      });
    } catch (error) {
      next(error);
    }
  }

  static async filtrar(req, res, next) {
    try {
      const filters = req.body;
      const pedidos = await PedidoObraService.getAll(filters);
      res.json({
        success: true,
        data: pedidos,
        count: pedidos.length,
        filters,
      });
    } catch (error) {
      next(error);
    }
  }

  static async create(req, res, next) {
    try {
      const pedidoData = req.body;
      const nuevoPedido = await PedidoObraService.create(pedidoData);
      res.status(201).json({
        success: true,
        message: "Pedido creado exitosamente",
        data: nuevoPedido,
      });
    } catch (error) {
      next(error);
    }
  }

  static async update(req, res, next) {
    try {
      const { idPedido } = req.params;
      const updateData = req.body;
      const pedidoActualizado = await PedidoObraService.update(
        idPedido,
        updateData,
      );
      res.json({
        success: true,
        message: "Pedido actualizado exitosamente",
        data: pedidoActualizado,
      });
    } catch (error) {
      next(error);
    }
  }

  static async delete(req, res, next) {
    try {
      const { idPedido } = req.params;
      const { codigoUsuarioBaja } = req.body;
      const pedidoEliminado = await PedidoObraService.delete(
        idPedido,
        codigoUsuarioBaja,
      );
      res.json({
        success: true,
        message: "Pedido eliminado exitosamente",
        data: pedidoEliminado,
      });
    } catch (error) {
      next(error);
    }
  }
}

import { PedidoObraService } from "../services/pedido-obra.service.js";

export class PedidoObraController {
  static async getByObras(req, res, next) {
    try {
      const { idsObras } = req.body;
      const pedidos = await PedidoObraService.getByObras(idsObras);
      res.json({ success: true, data: pedidos });
    } catch (error) {
      next(error);
    }
  }

  static async create(req, res, next) {
    try {
      const pedidoData = req.body;
      const nuevoPedido = await PedidoObraService.create(pedidoData);
      res.status(201).json({ success: true, data: nuevoPedido });
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
      res.json({ success: true, data: pedidoActualizado });
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
      res.json({ success: true, data: pedidoEliminado });
    } catch (error) {
      next(error);
    }
  }

  static async buscarConFiltros(req, res, next) {
    try {
      const filtros = req.body;
      const pedidos = await PedidoObraService.buscarConFiltros(filtros);
      res.status(200).json({
        success: true,
        data: pedidos,
        count: pedidos.length,
        filtros: filtros,
      });
    } catch (error) {
      next(error);
    }
  }
}

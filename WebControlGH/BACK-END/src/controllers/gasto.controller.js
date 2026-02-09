import { GastoService } from "../services/gasto.service.js";

export class GastoController {
  static async getAllGastosPorValidar(req, res, next) {
    try {
      const gastosPorValidar = await GastoService.getAllGastosPorValidar();
      res.json({ success: true, data: gastosPorValidar });
    } catch (error) {
      next(error);
    }
  }

  static async getAllGastosPorPagar(req, res, next) {
    try {
      const gastosPorPagar = await GastoService.getAllGastosPorPagar();
      res.json({ success: true, data: gastosPorPagar });
    } catch (error) {
      next(error);
    }
  }

  static async getGastosByObra(req, res, next) {
    try {
      const { idsObra } = req.body;
      const gastosPorObra = await GastoService.getGastosByObra(idsObra);
      res.json({ success: true, data: gastosPorObra });
    } catch (error) {
      next(error);
    }
  }

  static async getHorasExtraByObra(req, res, next) {
    try {
      const { idsObra } = req.body;
      const horasExtra = await GastoService.getHorasExtraByObra(idsObra);
      res.json({ success: true, data: horasExtra });
    } catch (error) {
      next(error);
    }
  }

  static async buscarConFiltros(req, res, next) {
    try {
      const filtros = req.body;
      const gastos = await GastoService.buscarConFiltros(filtros);
      res.status(200).json({
        success: true,
        data: gastos,
        count: gastos.length,
        filtros: filtros,
      });
    } catch (error) {
      next(error);
    }
  }
}

import { GastoModel } from "../models/gasto.model.js";

export class GastoController {
  static async getAllGastosPorValidar(req, res, next) {
    try {
      const gastosPorValidar = await GastoModel.getAllGastosPorValidar();
      res.json({ success: true, data: gastosPorValidar });
    } catch (error) {
      // Le pasamos el error al middleware ErrorHandler
      next(error);
    }
  }

  static async getAllGastosPorPagar(req, res, next) {
    try {
      const gastosPorPagar = await GastoModel.getAllGastosPorPagar();
      res.json({ success: true, data: gastosPorPagar });
    } catch (error) {
      next(error);
    }
  }

  static async getGastosByObra(req, res, next) {
    try {
      const { idsObra } = req.body;
      if (!Array.isArray(idsObra) || idsObra.length === 0) {
        return res.json({ success: true, data: [] });
      }
      const gastosPorObra = await GastoModel.getGastosByObra({ idsObra });
      res.json({ success: true, data: gastosPorObra });
    } catch (error) {
      next(error);
    }
  }

  static async getHorasExtraByObra(req, res, next) {
    try {
      const { idsObra } = req.body;
      if (!Array.isArray(idsObra) || idsObra.length === 0) {
        return res.json({ success: true, data: [] });
      }
      const horasExtra = await GastoModel.getHorasExtraByObra({ idsObra });
      res.json({ success: true, data: horasExtra });
    } catch (error) {
      next(error);
    }
  }
}

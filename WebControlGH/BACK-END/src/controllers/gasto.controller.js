import { GastoService } from "../services/gasto.service.js";

export class GastoController {
  static async getAll(req, res, next) {
    try {
      const filters = req.query;
      const result = await GastoService.getAll(filters);
      res.json({ success: true, ...result });
    } catch (error) {
      next(error);
    }
  }

  static async filtrar(req, res, next) {
    try {
      const filters = req.body;
      const result = await GastoService.getAll(filters);
      res.json({ success: true, ...result });
    } catch (error) {
      next(error);
    }
  }

  // TODO: Eliminar cuando el frontend use getAll(filters)
  static async getGastosByObra(req, res, next) {
    try {
      const { idsObra } = req.body;
      const gastosPorObra = await GastoService.getGastosByObra(idsObra);
      res.json({ success: true, data: gastosPorObra });
    } catch (error) {
      next(error);
    }
  }

  // TODO: Eliminar cuando el frontend use getAll(filters)
  static async getHorasExtraByObra(req, res, next) {
    try {
      const { idsObra } = req.body;
      const horasExtra = await GastoService.getHorasExtraByObra(idsObra);
      res.json({ success: true, data: horasExtra });
    } catch (error) {
      next(error);
    }
  }
}

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
}

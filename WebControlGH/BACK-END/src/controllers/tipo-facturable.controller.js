import { TipoFacturableService } from "../services/tipo-facturable.service.js";

export class TipoFacturableController {
  static async getAll(req, res, next) {
    try {
      const tipos = await TipoFacturableService.getAll();
      res.json({ success: true, data: tipos });
    } catch (error) {
      next(error);
    }
  }
}

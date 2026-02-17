import { TipoFacturaService } from "../services/tipo-factura.service.js";

export class TipoFacturaController {
  static async getAll(req, res, next) {
    try {
      const tipos = await TipoFacturaService.getAll();
      res.json({ success: true, data: tipos });
    } catch (error) {
      next(error);
    }
  }
}

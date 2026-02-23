import { TipoIvaService } from "../services/tipo-iva.service.js";

export class TipoIvaController {
  static async getAll(req, res, next) {
    try {
      const tipos = await TipoIvaService.getAll();
      res.json({ success: true, data: tipos });
    } catch (error) {
      next(error);
    }
  }
}

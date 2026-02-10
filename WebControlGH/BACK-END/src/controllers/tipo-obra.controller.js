import { TipoObraService } from "../services/tipo-obra.service.js";

export class TipoObraController {
  static async getAll(req, res, next) {
    try {
      const tipos = await TipoObraService.getAll();
      res.json({ success: true, data: tipos });
    } catch (error) {
      next(error);
    }
  }
}

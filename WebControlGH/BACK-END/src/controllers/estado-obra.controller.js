import { EstadoObraService } from "../services/estado-obra.service.js";

export class EstadoObraController {
  static async getAll(req, res, next) {
    try {
      const estados = await EstadoObraService.getAll();
      res.json({ success: true, data: estados });
    } catch (error) {
      next(error);
    }
  }
}

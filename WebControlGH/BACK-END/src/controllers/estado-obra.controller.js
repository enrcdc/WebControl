import { EstadoObraModel } from "../models/estado-obra.model.js";

export class EstadoObraController {
  static async getAll(req, res, next) {
    try {
      const estados = await EstadoObraModel.getAll();
      res.json({ success: true, data: estados });
    } catch (error) {
      next(error);
    }
  }
}



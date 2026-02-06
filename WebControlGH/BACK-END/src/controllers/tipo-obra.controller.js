import { TipoObraModel } from "../models/tipo-obra.model.js";

export class TipoObraController {
  static async getAll(req, res, next) {
    try {
      const tipos = await TipoObraModel.getAll();
      res.json({ success: true, data: tipos });
    } catch (error) {
      next(error);
    }
  }
}

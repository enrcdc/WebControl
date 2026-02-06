import { TipoFacturableModel } from "../models/tipo-facturable.model.js";

export class TipoFacturableController {
  static async getAll(req, res, next) {
    try {
      const tipos = await TipoFacturableModel.getAll();
      res.json({ success: true, data: tipos });
    } catch (error) {
      next(error);
    }
  }
}

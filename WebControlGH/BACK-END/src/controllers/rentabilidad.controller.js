import { RentabilidadModel } from "../models/rentabilidad.model.js";

export class RentabilidadController {
  static async getByIdObra(req, res, next) {
    try {
      const { idObra } = req.params;
      const rentabilidad = await RentabilidadModel.getByIdObra({ idObra });
      res.json({ success: true, data: rentabilidad });
    } catch (error) {
      next(error);
    }
  }
}


import { RentabilidadService } from "../services/rentabilidad.service.js";

export class RentabilidadController {
  static async getByIdObra(req, res, next) {
    try {
      const { idObra } = req.params;
      const rentabilidad = await RentabilidadService.getByIdObra(idObra);
      res.json({ success: true, data: rentabilidad });
    } catch (error) {
      next(error);
    }
  }
}

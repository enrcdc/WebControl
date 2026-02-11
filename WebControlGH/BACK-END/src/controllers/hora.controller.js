import { HoraService } from "../services/hora.service.js";

export class HoraController {
  // TODO: Darle una vuelta a esto. Necesito filters en el getAll y en el filtrar?
  static async getAll(req, res, next) {
    try {
      const filters = req.query;
      const horas = await HoraService.getAll(filters);
      res.json({
        success: true,
        data: horas,
        count: horas.length,
        filters,
      });
    } catch (error) {
      next(error);
    }
  }

  static async filtrar(req, res, next) {
    try {
      const filters = req.body;
      const horas = await HoraService.getAll(filters);
      res.json({
        success: true,
        data: horas,
        count: horas.length,
        filters,
      });
    } catch (error) {
      next(error);
    }
  }

  static async create(req, res, next) {
    try {
      const horaData = req.body;
      const nuevaHora = await HoraService.create(horaData);
      res.status(201).json({
        success: true,
        message: "Hora creada exitosamente",
        data: nuevaHora,
      });
    } catch (error) {
      next(error);
    }
  }
}

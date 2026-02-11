import { EdificioService } from "../services/edificio.service.js";

export class EdificioController {
  static async getAll(req, res, next) {
    try {
      const filters = req.query;
      const edificios = await EdificioService.getAll(filters);
      res.json({ success: true, data: edificios });
    } catch (error) {
      next(error);
    }
  }

  // TODO: Eliminar cuando el frontend use getAll(filters)
  static async getByNombre(req, res, next) {
    try {
      const { nombre } = req.query;
      const edificios = await EdificioService.getByNombre(nombre);
      res.json({ success: true, data: edificios });
    } catch (error) {
      next(error);
    }
  }
}

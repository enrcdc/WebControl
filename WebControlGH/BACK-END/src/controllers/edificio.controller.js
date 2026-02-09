import { EdificioService } from "../services/edificio.service.js";

export class EdificioController {
  static async getAll(req, res, next) {
    try {
      const edificios = await EdificioService.getAll();
      res.json({ success: true, data: edificios });
    } catch (error) {
      next(error);
    }
  }

  static async getByNombre(req, res, next) {
    try {
      const { nombre } = req.query;
      const edificios = await EdificioService.getByNombre(nombre);
      res.json({ success: true, data: edificios });
    } catch (error) {
      next(error);
    }
  }

  static async buscarConFiltros(req, res, next) {
    try {
      const filtros = req.body;
      const edificios = await EdificioService.buscarConFiltros(filtros);
      res.status(200).json({
        success: true,
        data: edificios,
        count: edificios.length,
        filtros: filtros,
      });
    } catch (error) {
      next(error);
    }
  }
}

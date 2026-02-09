import { HoraService } from "../services/hora.service.js";

export class HoraController {
  static async getAllHoras(req, res, next) {
    try {
      const horas = await HoraService.getAllHoras();
      res.json({ success: true, data: horas });
    } catch (error) {
      next(error);
    }
  }

  static async getByObra(req, res, next) {
    try {
      const { idsObra } = req.body;
      const horas = await HoraService.getByObra(idsObra);
      res.json({ success: true, data: horas });
    } catch (error) {
      next(error);
    }
  }

  static async getHorasBySubordinados(req, res, next) {
    try {
      const { managerCodigo } = req.params;
      const horas = await HoraService.getHorasBySubordinados(managerCodigo);
      res.json({ success: true, data: horas });
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

  static async buscarConFiltros(req, res, next) {
    try {
      const filtros = req.body;
      const horas = await HoraService.buscarConFiltros(filtros);
      res.status(200).json({
        success: true,
        data: horas,
        count: horas.length,
        filtros: filtros,
      });
    } catch (error) {
      next(error);
    }
  }
}

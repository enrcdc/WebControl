import { EdificioService } from "../services/edificio.service.js";

export class EdificioController {
  static async getAll(req, res, next) {
    try {
      const filters = req.query;
      const result = await EdificioService.getAll(filters);
      res.json({ success: true, ...result });
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

  static async create(req, res, next) {
    try {
      const edificio = await EdificioService.create(req.body);
      res.status(201).json({ success: true, data: edificio });
    } catch (error) {
      next(error);
    }
  }

  static async update(req, res, next) {
    try {
      const { idEdificio } = req.params;
      const updateData = req.body;
      const edificioActualizado = await EdificioService.update(
        idEdificio,
        updateData,
      );
      res.json({
        success: true,
        message: "Complejo actualizado exitosamente",
        data: edificioActualizado,
      });
    } catch (error) {
      next(error);
    }
  }

  static async delete(req, res, next) {
    try {
      const { idEdificios } = req.body;
      const edificiosEliminados = await EdificioService.delete(idEdificios);
      res.json({
        success: true,
        message: "Complejo(s) eliminado(s) exitosamente",
        data: edificiosEliminados,
      });
    } catch (error) {
      next(error);
    }
  }
}

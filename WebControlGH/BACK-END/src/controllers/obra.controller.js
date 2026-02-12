import { ObraService } from "../services/obra.service.js";

export class ObraController {
  static async getAll(req, res, next) {
    try {
      const filters = req.query;
      const result = await ObraService.getAll(filters);
      res.json({ success: true, ...result });
    } catch (error) {
      next(error);
    }
  }

  static async filtrar(req, res, next) {
    try {
      const filters = req.body;
      const result = await ObraService.getAll(filters);
      res.json({ success: true, ...result });
    } catch (error) {
      next(error);
    }
  }

  static async getById(req, res, next) {
    try {
      const { idObra } = req.params;
      const obra = await ObraService.getById(idObra);
      res.json({ success: true, data: obra });
    } catch (error) {
      next(error);
    }
  }

  // TODO: Eliminar cuando el frontend use getAll(filters)
  static async getByDescripcion(req, res, next) {
    try {
      const { descripcionObra } = req.query;
      const obras = await ObraService.getByDescripcion(descripcionObra);
      res.json({
        success: true,
        data: obras,
        count: obras.length,
      });
    } catch (error) {
      next(error);
    }
  }

  static async create(req, res, next) {
    try {
      const obraData = req.body;
      const nuevaObra = await ObraService.create(obraData);
      res.status(201).json({
        success: true,
        message: "Obra creada exitosamente",
        data: nuevaObra,
      });
    } catch (error) {
      next(error);
    }
  }

  static async update(req, res, next) {
    try {
      const { idObra } = req.params;
      const updateData = req.body;
      const obraActualizada = await ObraService.update(idObra, updateData);
      res.json({
        success: true,
        message: "Obra actualizada exitosamente",
        data: obraActualizada,
      });
    } catch (error) {
      next(error);
    }
  }

  static async delete(req, res, next) {
    try {
      const { idObra } = req.params;
      const { codigoUsuarioBaja } = req.body;
      const obraEliminada = await ObraService.delete(idObra, codigoUsuarioBaja);
      res.json({
        success: true,
        message: "Obra eliminada exitosamente",
        data: obraEliminada,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getEstadisticas(req, res, next) {
    try {
      const stats = await ObraService.getEstadisticas();
      res.json({ success: true, data: stats });
    } catch (error) {
      next(error);
    }
  }
}

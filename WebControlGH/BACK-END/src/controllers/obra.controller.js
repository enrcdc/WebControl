import { ObraModel } from "../models/obra.model.js";

export class ObraController {
  static async getAll(req, res, next) {
    try {
      const obras = await ObraModel.getAll();
      res.json({ success: true, data: obras });
    } catch (error) {
      next(error);
    }
  }

  static async getById(req, res, next) {
    try {
      const { idObra } = req.params;
      const obra = await ObraModel.getById({ idObra });

      if (!obra) {
        const error = new Error("Obra no encontrada");
        error.name = "NotFoundError";
        throw error;
      }
      res.json({ success: true, data: obra });
    } catch (error) {
      next(error);
    }
  }

  static async getByDescripcion(req, res, next) {
    try {
      const { descripcionObra } = req.query;
      const obras = await ObraModel.getByDescripcion({ descripcionObra });
      res.json({ success: true, data: obras });
    } catch (error) {
      next(error);
    }
  }

  static async create(req, res, next) {
    try {
      const input = req.body;
      const nuevaObra = await ObraModel.create({ input });
      res.status(201).json({ success: true, data: nuevaObra });
    } catch (error) {
      next(error);
    }
  }

  static async update(req, res, next) {
    try {
      const { idObra } = req.params;
      const input = req.body;

      const obraActualizada = await ObraModel.update({
        idObra: Number(idObra),
        input,
      });

      if (!obraActualizada) {
        const error = new Error("Obra no encontrada o no actualizada");
        error.name = "NotFoundError";
        throw error;
      }
      res.json({ success: true, data: obraActualizada });
    } catch (error) {
      next(error);
    }
  }

  static async delete(req, res, next) {
    try {
      const { idObra } = req.params;
      const { codigoUsuarioBaja } = req.body;

      /*
      if (!codigoUsuarioBaja) {
        const error = new Error("codigoUsuarioBaja es requerido para eliminar");
        error.name = "ValidationError";
        throw error;
      }*/

      const obraEliminada = await ObraModel.delete({
        idObra: Number(idObra),
        codigoUsuarioBaja,
      });

      if (!obraEliminada) {
        const error = new Error("Obra no encontrada o ya eliminada");
        error.name = "NotFoundError";
        throw error;
      }
      res.json({ success: true, data: obraEliminada });
    } catch (error) {
      next(error);
    }
  }
}

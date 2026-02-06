import { ResponsablesModel } from "../models/responsable.model.js";

export class ResponsablesController {
  static async getSubordinados(req, res, next) {
    try {
      const { codigoResponsable } = req.params;

      if (!codigoResponsable) {
        return res.status(400).json({
          success: false,
          message: "Código de responsable requerido",
        });
      }

      const subordinados = await ResponsablesModel.getSubordinadosByManager(
        codigoResponsable
      );
      res.json({ success: true, data: subordinados });
    } catch (error) {
      next(error);
    }
  }
}

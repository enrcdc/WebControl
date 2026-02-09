import { FacturaObraModel } from "../models/factura-obra.model.js";

export class FacturaObraController {
  static async getByObras(req, res, next) {
    try {
      const { idsObras } = req.body;
      if (!Array.isArray(idsObras) || idsObras.length === 0) {
        return res.json({ success: true, data: [] });
      }
      const facturas = await FacturaObraModel.getByObras({ idsObras });
      res.json({ success: true, data: facturas });
    } catch (error) {
      next(error);
    }
  }

  static async create(req, res, next) {
    try {
      const input = req.body;
      const nuevaFactura = await FacturaObraModel.create({ input });
      res.status(201).json({ success: true, data: nuevaFactura });
    } catch (error) {
      next(error);
    }
  }

  static async update(req, res, next) {
    try {
      const { idFactura } = req.params;
      const input = req.body;
      const facturaActualizada = await FacturaObraModel.update({
        idFactura: Number(idFactura),
        input,
      });

      if (!facturaActualizada) {
        const error = new Error("Factura no encontrada o actualizada");
        error.name = "NotFoundError";
        throw error;
      }
      res.json({ success: true, data: facturaActualizada });
    } catch (error) {
      next(error);
    }
  }

  static async delete(req, res, next) {
    try {
      const { idFactura } = req.params;
      const { codigoUsuarioBaja } = req.body;

      /* 
      if (!codigoUsuarioBaja) {
        const error = new Error("codigoUsuarioBaja es requerido para eliminar");
        error.name = "ValidationError";
        throw error;
      }
      */

      const facturaEliminada = await FacturaObraModel.delete({
        idFactura: Number(idFactura),
        codigoUsuarioBaja,
      });

      if (!facturaEliminada) {
        const error = new Error("Factura no encontrada o ya eliminada");
        error.name = "NotFoundError";
        throw error;
      }
      res.json({ success: true, data: facturaEliminada });
    } catch (error) {
      next(error);
    }
  }
}

import { FacturaObraService } from "../services/factura-obra.service.js";

export class FacturaObraController {
  static async getAll(req, res, next) {
    try {
      const filters = req.query;
      const result = await FacturaObraService.getAll(filters);
      res.json({ success: true, ...result });
    } catch (error) {
      next(error);
    }
  }

  static async filtrar(req, res, next) {
    try {
      const filters = req.body;
      const result = await FacturaObraService.getAll(filters);
      res.json({ success: true, ...result });
    } catch (error) {
      next(error);
    }
  }

  static async create(req, res, next) {
    try {
      const facturaData = req.body;
      const nuevaFactura = await FacturaObraService.create(facturaData);
      res.status(201).json({
        success: true,
        message: "Factura creada exitosamente",
        data: nuevaFactura,
      });
    } catch (error) {
      next(error);
    }
  }

  static async update(req, res, next) {
    try {
      const { idFactura } = req.params;
      const updateData = req.body;
      const facturaActualizada = await FacturaObraService.update(
        idFactura,
        updateData,
      );
      res.json({
        success: true,
        message: "Factura actualizada exitosamente",
        data: facturaActualizada,
      });
    } catch (error) {
      next(error);
    }
  }

  static async delete(req, res, next) {
    try {
      const { idFactura } = req.params;
      const { codigoUsuarioBaja } = req.body;
      const facturaEliminada = await FacturaObraService.delete(
        idFactura,
        codigoUsuarioBaja,
      );
      res.json({
        success: true,
        message: "Factura eliminada exitosamente",
        data: facturaEliminada,
      });
    } catch (error) {
      next(error);
    }
  }
}

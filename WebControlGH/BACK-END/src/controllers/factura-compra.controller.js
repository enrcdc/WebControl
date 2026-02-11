import { FacturaCompraService } from "../services/factura-compra.service.js";

export class FacturaCompraController {
  static async getAll(req, res, next) {
    try {
      const filters = req.query;
      const facturas = await FacturaCompraService.getAll(filters);
      res.json({
        success: true,
        data: facturas,
        count: facturas.length,
        filters,
      });
    } catch (error) {
      next(error);
    }
  }

  // TODO: Eliminar cuando el frontend use getAll(filters)
  static async getById(req, res, next) {
    try {
      const { id } = req.params;
      const factura = await FacturaCompraService.getById(id);
      res.json({ success: true, data: factura });
    } catch (error) {
      next(error);
    }
  }

  // TODO: Eliminar cuando el frontend use getAll(filters)
  static async getByObra(req, res, next) {
    try {
      const { idObra } = req.params;
      const facturas = await FacturaCompraService.getByObra(idObra);
      res.json({ success: true, data: facturas });
    } catch (error) {
      next(error);
    }
  }

  // TODO: Eliminar cuando el frontend use getAll(filters)
  static async getByConcepto(req, res, next) {
    try {
      const { concepto } = req.query;
      const facturas = await FacturaCompraService.getByConcepto(concepto);
      res.json({ success: true, data: facturas });
    } catch (error) {
      next(error);
    }
  }

  static async create(req, res, next) {
    try {
      const facturaData = req.body;
      const nuevaFactura = await FacturaCompraService.create(facturaData);
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
      const { id } = req.params;
      const updateData = req.body;
      const facturaActualizada = await FacturaCompraService.update(
        id,
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
      const { id } = req.params;
      const { codigoUsuarioBaja } = req.body;
      const facturaEliminada = await FacturaCompraService.delete(
        id,
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

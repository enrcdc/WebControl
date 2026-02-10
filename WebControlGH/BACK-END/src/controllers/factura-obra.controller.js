import { FacturaObraService } from "../services/factura-obra.service.js";

export class FacturaObraController {
  static async getByObras(req, res, next) {
    try {
      const { idsObras } = req.body;
      const facturas = await FacturaObraService.getByObras(idsObras);
      res.json({ success: true, data: facturas });
    } catch (error) {
      next(error);
    }
  }

  static async create(req, res, next) {
    try {
      const facturaData = req.body;
      const nuevaFactura = await FacturaObraService.create(facturaData);
      res.status(201).json({ success: true, data: nuevaFactura });
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
      res.json({ success: true, data: facturaActualizada });
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
      res.json({ success: true, data: facturaEliminada });
    } catch (error) {
      next(error);
    }
  }

  static async buscarConFiltros(req, res, next) {
    try {
      const filtros = req.body;
      const facturas = await FacturaObraService.buscarConFiltros(filtros);
      res.status(200).json({
        success: true,
        data: facturas,
        count: facturas.length,
        filtros: filtros,
      });
    } catch (error) {
      next(error);
    }
  }
}

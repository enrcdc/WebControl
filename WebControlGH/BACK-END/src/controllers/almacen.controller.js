import { AlmacenService } from "../services/almacen.service.js";

export class AlmacenController {
  static async getAll(req, res, next) {
    try {
      const filters = req.query;
      const result = await AlmacenService.getAll(filters);
      res.json({ success: true, ...result });
    } catch (error) {
      next(error);
    }
  }

  static async create(req, res, next) {
    try {
      const productoData = req.body;
      const nuevoProducto = await AlmacenService.create(productoData);
      res.status(201).json({
        success: true,
        message: "Producto creado exitosamente",
        data: nuevoProducto,
      });
    } catch (error) {
      next(error);
    }
  }

  static async update(req, res, next) {
    try {
      const { idProducto } = req.params;
      const updateData = req.body;
      const productoActualizado = await AlmacenService.update(
        idProducto,
        updateData,
      );
      res.json({
        success: true,
        message: "Producto actualizado exitosamente",
        data: productoActualizado,
      });
    } catch (error) {
      next(error);
    }
  }

  static async delete(req, res, next) {
    try {
      const { idProducto } = req.params;
      const { codigoUsuarioBaja } = req.body;
      const productoEliminado = await AlmacenService.delete(
        idProducto,
        codigoUsuarioBaja,
      );
      res.json({
        success: true,
        message: "Producto eliminado exitosamente",
        data: productoEliminado,
      });
    } catch (error) {
      next(error);
    }
  }
}

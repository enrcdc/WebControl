import { AlmacenService } from "../services/almacen.service.js";

export class AlmacenController {
  static async getAll(req, res, next) {
    try {
      const productos = await AlmacenService.getAll();
      res.json({ success: true, data: productos });
    } catch (error) {
      next(error);
    }
  }

  static async getById(req, res, next) {
    try {
      const { idProducto } = req.params;
      const producto = await AlmacenService.getById(idProducto);
      res.json({ success: true, data: producto });
    } catch (error) {
      next(error);
    }
  }

  static async getByDescripcion(req, res, next) {
    try {
      const { descripcion } = req.query;
      const productos = await AlmacenService.getByDescripcion(descripcion);
      res.json({ success: true, data: productos });
    } catch (error) {
      next(error);
    }
  }

  static async create(req, res, next) {
    try {
      const productoData = req.body;
      const nuevoProducto = await AlmacenService.create(productoData);
      res.status(201).json({ success: true, data: nuevoProducto });
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
      res.json({ success: true, data: productoActualizado });
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
      res.json({ success: true, data: productoEliminado });
    } catch (error) {
      next(error);
    }
  }

  static async buscarConFiltros(req, res, next) {
    try {
      const filtros = req.body;
      const productos = await AlmacenService.buscarConFiltros(filtros);
      res.status(200).json({
        success: true,
        data: productos,
        count: productos.length,
        filtros: filtros,
      });
    } catch (error) {
      next(error);
    }
  }
}

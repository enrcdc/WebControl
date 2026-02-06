import { AlmacenModel } from "../models/almacen.model.js";

export class AlmacenController {
  static async getAll(req, res, next) {
    try {
      const productos = await AlmacenModel.getAll();
      res.json({ success: true, data: productos });
    } catch (error) {
      next(error);
    }
  }

  static async getById(req, res, next) {
    try {
      const { idProducto } = req.params;
      const producto = await AlmacenModel.getById({ idProducto });
      res.json({ success: true, data: producto });
    } catch (error) {
      next(error);
    }
  }

  static async getByDescripcion(req, res, next) {
    try {
      const { descripcion } = req.query;
      const productos = await AlmacenModel.getByDescripcion({ descripcion });
      res.json({ success: true, data: productos });
    } catch (error) {
      next(error);
    }
  }

  static async create(req, res, next) {
    try {
      const input = req.body;
      const nuevoProducto = await AlmacenModel.create({ input });
      res.status(201).json({ success: true, data: nuevoProducto });
    } catch (error) {
      next(error);
    }
  }

  static async update(req, res, next) {
    try {
      const { idProducto } = req.params;
      const input = req.body;

      const productoActualizado = await AlmacenModel.update({
        idProducto: Number(idProducto),
        input,
      });

      if (!productoActualizado) {
        const error = new Error("Producto no encontrado o actualizado");
        error.name = "NotFoundError";
        throw error;
      }
      res.json({ success: true, data: productoActualizado });
    } catch (error) {
      next(error);
    }
  }

  static async delete(req, res, next) {
    try {
      const { idProducto } = req.params;
      const { codigoUsuarioBaja } = req.body;

      if (!codigoUsuarioBaja) {
        const error = new Error("codigoUsuarioBaja es requerido para eliminar");
        error.name = "ValidationError";
        throw error;
      }
      const productoEliminado = await AlmacenModel.delete({
        idProducto: Number(idProducto),
        codigoUsuarioBaja,
      });

      if (!productoEliminado) {
        const error = new Error("Producto no encontrado o ya eliminado");
        error.name = "NotFoundError";
        throw error;
      }
      res.json({ success: true, data: productoEliminado });
    } catch (error) {
      next(error);
    }
  }
}

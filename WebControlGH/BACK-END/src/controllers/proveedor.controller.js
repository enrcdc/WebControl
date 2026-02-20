import { ProveedorService } from "../services/proveedor.service.js";

// TODO: Revisar el Gestor CC para ver que más operaciones añadir

export class ProveedorController {
  static async getAll(req, res, next) {
    try {
      const filters = req.query;
      const result = await ProveedorService.getAll(filters);
      res.json({ success: true, ...result });
    } catch (error) {
      next(error);
    }
  }

  static async getById(req, res, next) {
    try {
      const { idProveedor } = req.params;
      const proveedor = await ProveedorService.getById(idProveedor);
      res.json({ success: true, data: proveedor });
    } catch (error) {
      next(error);
    }
  }

  static async getUltimoCodigo(req, res, next) {
    try {
      const resultado = await ProveedorService.getUltimoCodigo();
      res.json({ success: true, data: resultado });
    } catch (error) {
      next(error);
    }
  }

  static async create(req, res, next) {
    try {
      const proveedor = await ProveedorService.create(req.body);
      res.status(201).json({ success: true, data: proveedor });
    } catch (error) {
      next(error);
    }
  }

  static async update(req, res, next) {
    try {
      const { idProveedor } = req.params;
      const updateData = req.body;
      const proveedorActualizado = await ProveedorService.update(
        idProveedor,
        updateData,
      );
      res.json({
        success: true,
        message: "Proveedor actualizado exitosamente",
        data: proveedorActualizado,
      });
    } catch (error) {
      next(error);
    }
  }

  static async delete(req, res, next) {
    try {
      const { idProveedores } = req.body;
      const proveedoresEliminados = await ProveedorService.delete(idProveedores);
      res.json({
        success: true,
        message: "Proveedor(es) eliminado(s) exitosamente",
        data: proveedoresEliminados,
      });
    } catch (error) {
      next(error);
    }
  }
}

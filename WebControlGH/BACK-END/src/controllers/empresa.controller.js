import { EmpresaService } from "../services/empresa.service.js";

// TODO: Revisar el Gestor CC para ver que más operaciones añadir

export class EmpresaController {
  static async getAll(req, res, next) {
    try {
      const filters = req.query;
      const result = await EmpresaService.getAll(filters);
      res.json({ success: true, ...result });
    } catch (error) {
      next(error);
    }
  }

  // TODO: Eliminar cuando el frontend use getAll(filters)
  static async getByNombre(req, res, next) {
    try {
      const { nombre } = req.query;
      const empresas = await EmpresaService.getByNombre(nombre);
      res.json({ success: true, data: empresas });
    } catch (error) {
      next(error);
    }
  }

  static async create(req, res, next) {
    try {
      const empresa = await EmpresaService.create(req.body);
      res.status(201).json({ success: true, data: empresa });
    } catch (error) {
      next(error);
    }
  }

  static async update(req, res, next) {
    try {
      const { idEmpresa } = req.params;
      const updateData = req.body;
      const empresaActualizada = await EmpresaService.update(
        idEmpresa,
        updateData,
      );
      res.json({
        success: true,
        message: "Empresa actualizada exitosamente",
        data: empresaActualizada,
      });
    } catch (error) {
      next(error);
    }
  }

  static async delete(req, res, next) {
    try {
      const { idEmpresas } = req.body;
      const empresasEliminadas = await EmpresaService.delete(idEmpresas);
      res.json({
        success: true,
        message: "Empresa(s) eliminada(s) exitosamente",
        data: empresasEliminadas,
      });
    } catch (error) {
      next(error);
    }
  }
}

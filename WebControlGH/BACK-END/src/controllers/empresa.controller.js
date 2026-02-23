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

  static async getById(req, res, next) {
    try {
      const { idEmpresa } = req.params;
      const empresa = await EmpresaService.getById(idEmpresa);
      res.json({ success: true, data: empresa });
    } catch (error) {
      next(error);
    }
  }

  static async filtrar(req, res, next) {
    try {
      const filters = req.body;
      const result = await EmpresaService.getAll(filters);
      res.json({ success: true, ...result });
    } catch (error) {
      next(error);
    }
  }

  static async create(req, res, next) {
    try {
      const { data, sync } = await EmpresaService.create(req.body);
      res.status(201).json({ success: true, data, sync });
    } catch (error) {
      next(error);
    }
  }

  static async update(req, res, next) {
    try {
      const { idEmpresa } = req.params;
      const { data, sync } = await EmpresaService.update(idEmpresa, req.body);
      res.json({
        success: true,
        message: "Empresa actualizada exitosamente",
        data,
        sync,
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

import { EmpresaService } from "../services/empresa.service.js";

// TODO: Revisar el Gestor CC para ver que más operaciones añadir

export class EmpresaController {
  static async getAll(req, res, next) {
    try {
      const filters = req.query;
      const empresas = await EmpresaService.getAll(filters);
      res.json({ success: true, data: empresas });
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
}

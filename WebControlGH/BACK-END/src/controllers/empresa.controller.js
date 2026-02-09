import { EmpresaService } from "../services/empresa.service.js";

// TODO: Revisar el Gestor CC para ver que más operaciones añadir

export class EmpresaController {
  static async getAll(req, res, next) {
    try {
      const empresas = await EmpresaService.getAll();
      res.json({ success: true, data: empresas });
    } catch (error) {
      next(error);
    }
  }

  static async getByNombre(req, res, next) {
    try {
      const { nombre } = req.query;
      const empresas = await EmpresaService.getByNombre(nombre);
      res.json({ success: true, data: empresas });
    } catch (error) {
      next(error);
    }
  }

  static async buscarConFiltros(req, res, next) {
    try {
      const filtros = req.body;
      const empresas = await EmpresaService.buscarConFiltros(filtros);
      res.status(200).json({
        success: true,
        data: empresas,
        count: empresas.length,
        filtros: filtros,
      });
    } catch (error) {
      next(error);
    }
  }
}

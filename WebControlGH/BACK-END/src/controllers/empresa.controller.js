import { EmpresaModel } from "../models/empresa.model.js";

export class EmpresaController {
  static async getAll(req, res, next) {
    try {
      const empresas = await EmpresaModel.getAll();
      res.json({ success: true, data: empresas });
    } catch (error) {
      next(error);
    }
  }

  static async getByNombre(req, res, next) {
    try {
      const { nombre } = req.query;
      const empresas = await EmpresaModel.getByNombre({ nombre });
      res.status(200).json({ success: true, data: empresas });
    } catch (error) {
      next(error);
    }
  }
}

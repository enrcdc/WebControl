import { TipoGastoService } from "../services/tipo-gasto.service.js";

export class TipoGastoController {
  static async getAll(req, res, next) {
    try {
      const filters = req.query;
      const result = await TipoGastoService.getAll(filters);
      res.json({ success: true, ...result });
    } catch (error) {
      next(error);
    }
  }

  static async filtrar(req, res, next) {
    try {
      const filters = req.body;
      const result = await TipoGastoService.getAll(filters);
      res.json({ success: true, ...result });
    } catch (error) {
      next(error);
    }
  }

  static async getById(req, res, next) {
    try {
      const { idTipoGasto } = req.params;
      const tipoGasto = await TipoGastoService.getById(idTipoGasto);
      res.json({ success: true, data: tipoGasto });
    } catch (error) {
      next(error);
    }
  }

  static async create(req, res, next) {
    try {
      const tipoGasto = await TipoGastoService.create(req.body);
      res.status(201).json({ success: true, data: tipoGasto });
    } catch (error) {
      next(error);
    }
  }

  static async update(req, res, next) {
    try {
      const { idTipoGasto } = req.params;
      const tipoGastoActualizado = await TipoGastoService.update(
        idTipoGasto,
        req.body,
      );
      res.json({
        success: true,
        message: "Tipo de gasto actualizado exitosamente",
        data: tipoGastoActualizado,
      });
    } catch (error) {
      next(error);
    }
  }

  static async delete(req, res, next) {
    try {
      const { idsTipoGasto } = req.body;
      const resultado = await TipoGastoService.delete(idsTipoGasto);
      res.json({
        success: true,
        message: "Tipo(s) de gasto eliminado(s) exitosamente",
        data: resultado,
      });
    } catch (error) {
      next(error);
    }
  }
}

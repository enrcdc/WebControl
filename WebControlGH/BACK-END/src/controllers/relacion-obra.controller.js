import { RelacionObrasModel } from "../models/relacion-obra.model.js";

export class RelacionObrasController {
  static async getObraPadre(req, res, next) {
    try {
      const { idObra } = req.params;
      const obraPadre = await RelacionObrasModel.getObraPadre({ idObra });
      res.json({ success: true, data: obraPadre });
    } catch (error) {
      next(error);
    }
  }

  static async getObrasHijas(req, res, next) {
    try {
      const { idObra } = req.params;
      const obrasHijas = await RelacionObrasModel.getObrasHijas({ idObra });
      res.json({ success: true, data: obrasHijas });
    } catch (error) {
      next(error);
    }
  }

  static async setObraPadre(req, res, next) {
    try {
      const { idObraPadre, idObraHija } = req.body;
      const relacion = await RelacionObrasModel.setObraPadre({
        idObraPadre,
        idObraHija,
      });
      res.json({ success: true, data: relacion });
    } catch (error) {
      next(error);
    }
  }

  static async setObrasHijas(req, res, next) {
    try {
      const { idObraPadre, idsObrasHijas } = req.body;
      const relaciones = await RelacionObrasModel.setObrasHijas({
        idObraPadre,
        idsObrasHijas,
      });
      res.json({ success: true, data: relaciones });
    } catch (error) {
      next(error);
    }
  }
}

import { RelacionObraService } from "../services/relacion-obra.service.js";

export class RelacionObraController {
  static async getObraPadre(req, res, next) {
    try {
      const { idObra } = req.params;
      const obraPadre = await RelacionObraService.getObraPadre(idObra);
      res.json({ success: true, data: obraPadre });
    } catch (error) {
      next(error);
    }
  }

  static async getObrasHijas(req, res, next) {
    try {
      const { idObra } = req.params;
      const obrasHijas = await RelacionObraService.getObrasHijas(idObra);
      res.json({ success: true, data: obrasHijas });
    } catch (error) {
      next(error);
    }
  }

  static async setObraPadre(req, res, next) {
    try {
      const { idObraPadre, idObraHija } = req.body;
      const relacion = await RelacionObraService.setObraPadre(
        idObraPadre,
        idObraHija,
      );
      res.json({ success: true, data: relacion });
    } catch (error) {
      next(error);
    }
  }

  static async setObrasHijas(req, res, next) {
    try {
      const { idObraPadre, idsObrasHijas } = req.body;
      const relaciones = await RelacionObraService.setObrasHijas(
        idObraPadre,
        idsObrasHijas,
      );
      res.json({ success: true, data: relaciones });
    } catch (error) {
      next(error);
    }
  }
}

import { ResponsableService } from "../services/responsable.service.js";

export class ResponsableController {
  static async getSubordinados(req, res, next) {
    try {
      const { codigoResponsable } = req.params;
      const subordinados =
        await ResponsableService.getSubordinados(codigoResponsable);
      res.json({ success: true, data: subordinados });
    } catch (error) {
      next(error);
    }
  }
}

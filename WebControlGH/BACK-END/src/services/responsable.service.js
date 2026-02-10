import { ResponsableModel } from "../models/responsable.model.js";
import { InvalidDataError } from "../errors/index.js";

export class ResponsableService {
  static async getSubordinados(codigoResponsable) {
    if (!codigoResponsable) {
      throw new InvalidDataError("Código de responsable requerido", {
        field: "codigoResponsable",
      });
    }

    const subordinados = await ResponsableModel.getSubordinadosByManager({
      codigoManager: codigoResponsable,
    });
    return subordinados;
  }
}

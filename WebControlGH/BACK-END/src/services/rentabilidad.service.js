import { RentabilidadModel } from "../models/rentabilidad.model.js";
import { NotFoundError } from "../errors/index.js";
import { validateId } from "../utils/index.js";

export class RentabilidadService {
  static async getByIdObra(idObra) {
    const validId = validateId(idObra, "ID de obra");

    const rentabilidad = await RentabilidadModel.getByIdObra({
      idObra: validId,
    });

    if (!rentabilidad) {
      throw new NotFoundError("Rentabilidad", idObra);
    }

    return rentabilidad;
  }
}

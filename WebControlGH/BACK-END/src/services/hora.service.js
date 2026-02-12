import { HoraModel } from "../models/hora.model.js";
import { NotFoundError } from "../errors/index.js";
import { validateNotEmpty } from "../utils/index.js";

export class HoraService {
  static async getAll(filters = {}) {
    const { data, pagination } = await HoraModel.getAll(filters);

    if (!data || data.length === 0) {
      throw new NotFoundError(
        "Horas",
        null,
        "No hay horas registradas en el sistema",
      );
    }

    return { data, pagination };
  }

  static async create(horaData) {
    validateNotEmpty(horaData, "datos de la hora");

    const nuevaHora = await HoraModel.create({ input: horaData });

    if (!nuevaHora) {
      throw new Error("Error al crear la hora");
    }

    return nuevaHora;
  }
}

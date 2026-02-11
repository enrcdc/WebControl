import { HoraModel } from "../models/hora.model.js";
import { NotFoundError } from "../errors/index.js";
import { validateNotEmpty } from "../utils/index.js";

export class HoraService {
  static async getAll(filters = {}) {
    const horas = await HoraModel.getAll(filters);

    if (!horas || horas.length === 0) {
      throw new NotFoundError(
        "Horas",
        null,
        "No hay horas registradas en el sistema",
      );
    }

    return horas;
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

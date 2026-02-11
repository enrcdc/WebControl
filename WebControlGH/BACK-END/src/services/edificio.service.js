import { EdificioModel } from "../models/edificio.model.js";
import { NotFoundError } from "../errors/index.js";
import { validateAndSanitizeString } from "../utils/index.js";

export class EdificioService {
  static async getAll(filters = {}) {
    const edificios = await EdificioModel.getAll(filters);

    if (!edificios || edificios.length === 0) {
      throw new NotFoundError(
        "Edificios",
        null,
        "No hay edificios registrados en el sistema",
      );
    }

    return edificios;
  }

  // TODO: Eliminar cuando el frontend use getAll(filters)
  static async getByNombre(nombre) {
    const sanitized = validateAndSanitizeString(nombre, "nombre de edificio", {
      minLength: 2,
    });

    const edificios = await EdificioModel.getByNombre({ nombre: sanitized });

    if (!edificios || edificios.length === 0) {
      throw new NotFoundError(
        "Edificios",
        null,
        `No se encontraron edificios con el nombre "${sanitized}"`,
      );
    }

    return edificios;
  }
}

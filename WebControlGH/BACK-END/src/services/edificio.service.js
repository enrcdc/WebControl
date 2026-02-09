import { EdificioModel } from "../models/edificio.model.js";
import { NotFoundError } from "../errors/index.js";
import { validateAndSanitizeString } from "../utils/index.js";

export class EdificioService {
  static async getAll() {
    const edificios = await EdificioModel.getAll();

    if (!edificios || edificios.length === 0) {
      throw new NotFoundError(
        "Edificios",
        null,
        "No hay edificios registrados en el sistema",
      );
    }

    return edificios;
  }

  // TODO: De momento hay este, pero se pueden añadir más.
  // (Retirar getByNombre cuando ya no se necesite). Debe ser un includes no un ===
  static async buscarConFiltros(filtros) {
    let edificios = await this.getAll();

    if (filtros.nombre) {
      edificios = edificios.filter((e) =>
        e.nombre.toLowerCase().includes(filtros.nombre.toLowerCase()),
      );
    }

    return edificios;
  }

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

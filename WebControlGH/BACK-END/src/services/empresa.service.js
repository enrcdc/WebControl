import { EmpresaModel } from "../models/empresa.model.js";
import { NotFoundError } from "../errors/index.js";
import { validateAndSanitizeString } from "../utils/index.js";

export class EmpresaService {
  static async getAll() {
    const empresas = await EmpresaModel.getAll();

    if (!empresas || empresas.length === 0) {
      throw new NotFoundError(
        "Empresas",
        null,
        "No hay empresas registradas en el sistema",
      );
    }

    return empresas;
  }

  // TODO: De momento hay este, pero se pueden añadir más.
  // (Retirar getByNombre cuando ya no se necesite)
  static async buscarConFiltros(filtros) {
    let empresas = await this.getAll();

    if (filtros.nombre) {
      empresas = empresas.filter((e) => e.nombre === filtros.nombre);
    }

    return empresas;
  }

  static async getByNombre(nombre) {
    const sanitized = validateAndSanitizeString(nombre, "nombre de empresa", {
      minLength: 2,
    });

    const empresas = await EmpresaModel.getByNombre({ nombre: sanitized });

    if (!empresas || empresas.length === 0) {
      throw new NotFoundError(
        "Empresas",
        null,
        `No se encontraron empresas con el nombre "${sanitized}"`,
      );
    }

    return empresas;
  }
}

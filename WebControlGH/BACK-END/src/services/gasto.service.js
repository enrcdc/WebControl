import { GastoModel } from "../models/gasto.model.js";
import { NotFoundError, InvalidDataError } from "../errors/index.js";

export class GastoService {
  static async getAllGastosPorValidar() {
    const gastos = await GastoModel.getAllGastosPorValidar();

    if (!gastos || gastos.length === 0) {
      throw new NotFoundError(
        "Gastos",
        null,
        "No hay gastos pendientes de validar",
      );
    }

    return gastos;
  }

  static async getAllGastosPorPagar() {
    const gastos = await GastoModel.getAllGastosPorPagar();

    if (!gastos || gastos.length === 0) {
      throw new NotFoundError(
        "Gastos",
        null,
        "No hay gastos pendientes de pagar",
      );
    }

    return gastos;
  }

  // TODO: Este debería ser sustituido por el de búsqueda por filtros
  static async getGastosByObra(idsObra) {
    this._validateIdsObra(idsObra);

    const gastos = await GastoModel.getGastosByObra({ idsObra });

    return gastos;
  }

  // TODO: Este debería ser sustituido por el de búsqueda por filtros
  static async getHorasExtraByObra(idsObra) {
    this._validateIdsObra(idsObra);

    const horasExtra = await GastoModel.getHorasExtraByObra({ idsObra });

    return horasExtra;
  }

  // TODO: De momento hay los métodos específicos, pero se pueden unificar.
  static async buscarConFiltros(filtros) {
    let gastos = [];

    /* Seleccionar gastos según tipo 
      -> Todos los no validados (por-validar)
      -> Todos los no pagados (por-pagar)
      -> Asociados a una obra (por-obra)
    */
    if (filtros.tipo === "por-validar") {
      gastos = await GastoModel.getAllGastosPorValidar();
    } else if (filtros.tipo === "por-pagar") {
      gastos = await GastoModel.getAllGastosPorPagar();
    } else if (filtros.tipo === "por-obras") {
      if (filtros.idsObra === undefined)
        throw new InvalidDataError(
          "Se necesita especificar el id de la obra con la opción por-obras",
          { field: "idObra" },
        );
      gastos = await GastoModel.getGastosByObra({ idsObra: filtros.idsObra });
    } else {
      throw new InvalidDataError(
        "Se necesita especificar un tipo para el filtrado [por-validar, por-pagar, por-obras]",
        { field: "tipo " },
      );
    }

    // TODO: Hay que darle una vuelta para saber si se quiere === o includes
    // (Este filtro no es relevantes si se especifica el id de la obras)
    if (filtros.codigoObra && filtros.tipo !== "por-obras") {
      gastos = gastos.filter((g) =>
        g.codigo_obra?.toLowerCase().includes(filtros.codigoObra.toLowerCase()),
      );
    }

    // (Este filtro no es relevantes si se especifica el id de la obras)
    if (filtros.descripcionObra && filtros.tipo !== "por-obras") {
      gastos = gastos.filter((g) =>
        g.descripcion_obra
          ?.toLowerCase()
          .includes(filtros.descripcionObra.toLowerCase()),
      );
    }

    if (filtros.tipoGasto) {
      gastos = gastos.filter((g) =>
        g.descripcion_gasto
          ?.toLowerCase()
          .includes(filtros.tipoGasto.toLowerCase()),
      );
    }

    if (filtros.usuarioAlta) {
      gastos = gastos.filter((g) => g.usuario_alta === filtros.usuarioAlta);
    }

    return gastos;
  }

  // ============================================
  // MÉTODOS PRIVADOS
  // ============================================

  static _validateIdsObra(idsObra) {
    if (!Array.isArray(idsObra) || idsObra.length === 0) {
      throw new InvalidDataError("Se requiere al menos un ID de obra", {
        field: "idsObra",
      });
    }
  }
}

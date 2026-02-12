import { db } from "../config/database.js";
import { applyPagination } from "../utils/index.js";

// TODO: Faltan más operaciones CRUD

export class GastoModel {
  /**
   * getAll recupera todos los gastos según los filtros proporcionados.
   * Si no se especifica un filtro, devuelve todos los registros.
   * @param {Object} filters - El objeto de filtros.
   * @param {number} [filters.idGasto] - filtrar por id
   * @param {string} [filters.tipo] - "por-validar" | "por-pagar"
   * @param {Array<number>} [filters.idsObra] - filtrar por ids de obra [Array]
   * @param {string} [filters.codigoObra] - filtrar por código de obra
   * @param {string} [filters.descripcionObra] - filtrar por descripción de obra
   * @param {string} [filters.tipoGasto] - filtrar por tipo de gasto
   * @param {string} [filters.usuarioAlta] - filtrar por usuario de alta
   * @returns {Promise<Array>} Array de resultados de filtrado
   * 
   * @note Es recomendable especificar al menos el filtro de "filters.tipo" porque recuperar todos los
   * registros de gastos es costoso.
   */
  static async getAll(filters = {}) {
    const query = db("gastosobra as g")
      .select(
        "g.*",
        db.ref("u.codigo_firma").as("usuario_alta"),
        "o.codigo_obra",
        "o.descripcion_obra",
        db.ref("tg.descripcion").as("descripcion_gasto"),
        db.ref("u2.codigo_firma").as("usuario_validacion"),
        db.ref("u3.codigo_firma").as("usuario_pago"),
      )
      .leftJoin("obras as o", "g.id_obra", "o.id_obra")
      .leftJoin("tipogasto as tg", "g.id_tipogasto", "tg.id_tipogasto")
      .leftJoin("usuarios as u", "g.codigo_usuario", "u.codigo_usuario")
      .leftJoin(
        "usuarios as u2",
        "g.codigo_usuario_validacion",
        "u2.codigo_usuario",
      )
      .leftJoin("usuarios as u3", "g.codigo_usuario_pago", "u3.codigo_usuario");

    if (filters.idGasto) {
      query.where("g.id_gastosobra", filters.idGasto);
    }

    if (filters.tipo === "por-validar") {
      query.whereNull("g.codigo_usuario_validacion");
    } else if (filters.tipo === "por-pagar") {
      query.whereNull("g.codigo_usuario_pago");
    }

    if (filters.idsObra) {
      query.whereIn("g.id_obra", filters.idsObra);
    }

    // TODO: Ver si es necesario este filtro. Ver si es necesario un filtro de fechas
    if (filters.codigoObra) {
      query.where("o.codigo_obra", "like", `%${filters.codigoObra}%`);
    }

    if (filters.descripcionObra) {
      query.where(
        "o.descripcion_obra",
        "like",
        `%${filters.descripcionObra}%`,
      );
    }

    if (filters.tipoGasto) {
      query.where("tg.descripcion", "like", `%${filters.tipoGasto}%`);
    }

    if (filters.usuarioAlta) {
      query.where("u.codigo_firma", filters.usuarioAlta);
    }

    return applyPagination(query, filters);
  }

  // TODO: Eliminar cuando el frontend use getAll(filters)
  static async getGastosByObra({ idsObra }) {
    return db("gastosobra as g")
      .select(
        "g.fecha_gasto",
        db.ref("u.codigo_firma").as("usuario_alta"),
        db.ref("tg.descripcion").as("descripcion_gasto"),
        "g.fecha_validacion",
        db.ref("u2.codigo_firma").as("usuario_validacion"),
        "g.pagado_visa",
        "g.fecha_pago",
        "g.cantidad",
        "g.importe",
        "g.observaciones",
      )
      .leftJoin("usuarios as u", "g.codigo_usuario", "u.codigo_usuario")
      .leftJoin(
        "usuarios as u2",
        "g.codigo_usuario_validacion",
        "u2.codigo_usuario",
      )
      .leftJoin("tipogasto as tg", "g.id_tipogasto", "tg.id_tipogasto")
      .whereIn("g.id_obra", idsObra);
  }

  // TODO: Eliminar cuando el frontend use getAll(filters)
  static async getHorasExtraByObra({ idsObra }) {
    return db("gastosobra as g")
      .select(
        "g.fecha_gasto",
        db.ref("u.codigo_firma").as("usuario"),
        "tg.descripcion",
        "g.fecha_validacion",
        db.ref("u2.codigo_firma").as("usuario_validacion"),
        "g.pagado_visa",
        "g.fecha_pago",
        "g.cantidad",
        "g.importe",
      )
      .leftJoin("tipogasto as tg", "g.id_tipogasto", "tg.id_tipogasto")
      .leftJoin("usuarios as u", "g.codigo_usuario", "u.codigo_usuario")
      .leftJoin(
        "usuarios as u2",
        "g.codigo_usuario_validacion",
        "u2.codigo_usuario",
      )
      .where("tg.descripcion", "Hora Extra")
      .whereIn("g.id_obra", idsObra);
  }
}

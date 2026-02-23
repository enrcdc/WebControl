import { db } from "../config/database.js";
import { applyPagination } from "../utils/index.js";

export class TipoGastoModel {
  /**
   *
   * getAll recupera todos los registros según los filtros proporcionados.
   * Si no se especifica un filtro, devuelve todos los registros.
   * @param {Object} filters - El objeto de filtros.
   * @param {Array<string>} [filters.ids] - filtrar por un array de ids
   * @param {Array<string>} [filters.idsIva] - filtrar por ids de los tipos de IVA
   * @returns {Promise<Array>} Array de resultados de filtrado
   */
  static async getAll(filters = {}) {
    const query = db("tipogasto as tg")
      .select(
        db.ref("tg.id_tipogasto").as("id"),
        "tg.descripcion",
        "tg.etiqueta",
        "tg.importe",
        "tg.porcentaje",
        "tg.id_tipoiva",
        db.ref("ti.descripcion").as("descripcion_iva"),
        "tg.observaciones",
        "tg.conhoras",
        db.ref("tg.eshora").as("eshoraextra"),
        "tg.fecha_baja",
      )
      .leftJoin("tipoiva as ti", "tg.id_tipoiva", "ti.id_tipoiva")
      .orderBy("tg.etiqueta");

    if (filters.ids) {
      query.whereIn("tg.id_tipogasto", filters.ids);
    }

    if (filters.descripcion) {
      query.where("tg.descripcion", "like", `%${filters.descripcion}%`);
    }

    if (filters.idsIva) {
      query.whereIn("tg.id_tipoiva", filters.idsIva);
    }

    if (!filters.mostrarBaja) {
      query.whereNull("tg.fecha_baja");
    }

    return applyPagination(query, filters);
  }

  static async getById({ idTipoGasto }) {
    return (
      db("tipogasto")
        .select(
          db.ref("id_tipogasto").as("id"),
          "descripcion",
          "etiqueta",
          "importe",
          "porcentaje",
          "id_tipoiva",
          "observaciones",
          "conhoras",
          db.ref("eshora").as("eshoraextra"),
          "fecha_baja",
        )
        .where("id_tipogasto", idTipoGasto)
        .first() ?? null
    );
  }

  static async create(input) {
    const [idTipoGasto] = await db("tipogasto").insert({
      descripcion: input.descripcion,
      etiqueta: input.etiqueta,
      importe: input.importe,
      porcentaje: input.porcentaje,
      id_tipoiva: input.tipoIva,
      observaciones: input.observaciones,
      conhoras: input.conHoras,
      esHora: input.esHoraExtra,
    });

    const tipoGasto = await db("tipogasto")
      .select("*")
      .where("id_tipogasto", idTipoGasto)
      .first();

    return tipoGasto ?? null;
  }

  static async update({ idTipoGasto, input }) {
    await db("tipogasto").where("id_tipogasto", idTipoGasto).update({
      descripcion: input.descripcion,
      etiqueta: input.etiqueta,
      importe: input.importe,
      porcentaje: input.porcentaje,
      id_tipoiva: input.tipoIva,
      observaciones: input.observaciones,
      conhoras: input.conHoras,
      esHora: input.esHoraExtra,
      fecha_baja: input.fechaBaja,
    });

    return db("tipogasto").where("id_tipogasto", idTipoGasto).first() ?? null;
  }

  // SOFT DELETE. DAR DE BAJA TIPOS DE GASTOS
  static async delete({ idsTipoGasto }) {
    const affectedRows = await db("tipogasto")
      .whereIn("id_tipogasto", idsTipoGasto)
      .update({
        fecha_baja: db.fn.now(),
      });

    if (affectedRows === 0) {
      return null;
    }

    return (
      db("tipogasto")
        .select("id_tipogasto", "descripcion", "fecha_baja")
        .whereIn("id_tipogasto", idsTipoGasto) ?? null
    );
  }
}

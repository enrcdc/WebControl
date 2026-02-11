import { db } from "../config/database.js";

// TODO: Faltan más operaciones CRUD

export class EdificioModel {
  /**
   *
   * getAll recupera todos los registros según los filtros proporcionados.
   * Si no se especifica un filtro, devuelve todos los registros.
   * @param {Object} filters - El objeto de filtros.
   * @param {string} [filters.idEdificio] - filtrar por id
   * @param {string} [filters.nombre] - filtrar por nombre del complejo
   * @returns {Promise<Array>} Array de resultados de filtrado
   */
  static async getAll(filters = {}) {
    const query = db("edificios")
      .select(db.ref("id_edificio").as("id"), "nombre")
      .orderBy("nombre");

    if (filters.idEdificio) {
      query.where("id_edificio", filters.idEdificio);
    }

    if (filters.nombre) {
      query.where("nombre", "like", `%${filters.nombre}%`);
    }

    return query;
  }

  // TODO: Eliminar cuando el frontend use getAll(filters)
  static async getByNombre({ nombre }) {
    return db("edificios")
      .select(db.ref("id_edificio").as("id"), "nombre")
      .where("nombre", "like", `%${nombre}%`);
  }
}

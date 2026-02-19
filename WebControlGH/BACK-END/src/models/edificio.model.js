import { db } from "../config/database.js";
import { applyPagination } from "../utils/index.js";

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
    const query = db("edificios as e")
      .select(
        db.ref("id_edificio").as("id"),
        "nombre",
        "direccion",
        "telefono1",
        "telefono2",
        "email",
        "observaciones",
        db.ref("pordefecto").as("porDefecto"),
        "fecha_baja",
      )
      .orderBy("e.nombre");

    if (filters.idEdificio) {
      query.where("id_edificio", filters.idEdificio);
    }

    if (filters.nombre) {
      query.where("nombre", "like", `%${filters.nombre}%`);
    }

    // Por defecto solo muestra activos; mostrarBaja=1 muestra todos
    if (!filters.mostrarBaja || filters.mostrarBaja === "0") {
      query.whereNull("fecha_baja");
    }

    // Filtro por contacto asociado (via edificios_contactos)
    if (filters.idContacto) {
      query.whereExists(
        db("edificios_contactos")
          .select(db.raw("1"))
          .whereRaw("edificios_contactos.id_edificio = edificios.id_edificio")
          .where("edificios_contactos.id_contacto", filters.idContacto),
      );
    }

    return applyPagination(query, filters);
  }

  static async getById({ idEdificio }) {
    return (
      db("edificios as e")
        .select(
          db.ref("id_edificio").as("id"),
          "nombre",
          "direccion",
          "telefono1",
          "telefono2",
          "email",
          "observaciones",
          db.ref("pordefecto").as("porDefecto"),
          "fecha_baja",

          // Contactos como array
          db.raw(`
        (
        SELECT COALESCE(
          JSON_ARRAYAGG(
            JSON_OBJECT(
              'id', t.id_contacto,
              'nombre', t.nombre_contacto,
              'apellido1', t.apellido1,
              'apellido2', t.apellido2
            )
          ),
          JSON_ARRAY() )
        
        FROM (
          SELECT DISTINCT 
            c.id_contacto,
            c.nombre_contacto,
            c.apellido1,
            c.apellido2
          FROM edificios_contactos edc
          JOIN contactos c
          ON edc.id_contacto = c.id_contacto
          WHERE edc.id_edificio = e.id_edificio
        ) t
        ) as contactos
      `),
        )
        .where("e.id_edificio", idEdificio)
        .first() ?? null
    );
  }

  static async create(input) {
    const [idEdificio] = await db("edificios").insert({
      nombre: input.nombre,
      direccion: input.direccion,
      telefono1: input.telefono1,
      telefono2: input.telefono2,
      email: input.email,
      pordefecto: input.porDefecto,
      observaciones: input.observaciones,
    });

    await this._asignarContactos(idEdificio, input.contactos);

    return (
      db("edificios")
        .select("id_edificio", "nombre")
        .where("id_edificio", idEdificio)
        .first() ?? null
    );
  }

  static async update({ idEdificio, input }) {
    await db("edificios").where("id_edificio", idEdificio).update({
      nombre: input.nombre,
      direccion: input.direccion,
      telefono1: input.telefono1,
      telefono2: input.telefono2,
      email: input.email,
      pordefecto: input.porDefecto,
      observaciones: input.observaciones,
    });

    await this._asignarContactos(idEdificio, input.contactos);

    return db("edificios").where("id_edificio", idEdificio).first() ?? null;
  }

  // SOFT DELETE. DAR DE BAJA COMPLEJOS
  // TODO: Esta operación (junto con la creación y actualización) requeriría permisos especiales
  static async delete({ idEdificios }) {
    const affectedRows = await db("edificios")
      .whereIn("id_edificio ", idEdificios)
      .update({
        fecha_baja: db.fn.now(),
      });

    if (affectedRows === 0) {
      return null;
    }

    return (
      db("edificios")
        .select("id_edificio", "nombre", "fecha_baja")
        .whereIn("id_edificio", idEdificios) ?? null
    );
  }

  // ============================================
  // MÉTODOS PRIVADOS
  // ============================================

  static async _asignarContactos(idEdificio, contactos) {
    await db("edificios_contactos").where("id_edificio", idEdificio).del();

    const rows = contactos.map((idContacto) => ({
      id_edificio: idEdificio,
      id_contacto: idContacto,
    }));

    return db("edificios_contactos").insert(rows);
  }
}

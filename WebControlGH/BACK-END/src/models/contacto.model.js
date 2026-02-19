import { db } from "../config/database.js";
import { applyPagination } from "../utils/index.js";

/* TODO: Cuando se trabaje con la BBDD de producción mirar cómo están establecidos 
 * los índices de las tablas de relaciones en general (edificios_contactos, etc). 
 * Lo ideal es que los índices sean compuestos, no individuales, 
 * por razones de optimización. 
 * 
 * Habría que ejecutar:
 * 
 * CREATE INDEX idx_edc_contacto_edificio
 * ON edificios_contactos (id_contacto, id_edificio);
 * 
 * Así estableces un índice dual. Borrarías los índices individuales sólo si no 
 * se usan en otra consulta.
// 

*/
export class ContactoModel {
  /**
   *
   * getAll recupera todos los registros según los filtros proporcionados.
   * Si no se especifica un filtro, devuelve todos los registros.
   * @param {Object} filters - El objeto de filtros.
   * @param {string} [filters.idsContacto] - filtrar por ids
   * @param {string} [filters.nombre] - filtrar por nombre
   * @param {string} [filters.apellido] - filtrar por apellido
   * @param {string} [filters.empresa] - filtrar por nombre de empresa
   * @param {string} [filters.idsEmpresa] - filtrar por ids de empresas
   * @param {string} [filters.idsEdificio] - filtrar por ids de edificios
   * @returns {Promise<Array>} Array de resultados de filtrado
   */
  static async getAll(filters = {}) {
    const query = db("contactos as c")
      .select(
        db.ref("c.id_contacto").as("id"),
        db.ref("c.nombre_contacto").as("nombre"),
        "c.apellido1",
        "c.apellido2",
        db.ref("c.num_identificativo").as("dni"),
        "c.telefono",
        "c.telefono2",
        "c.email",
        "c.email2",
        "c.direccion",
        "c.observaciones",
        "c.fecha_baja",
        db.raw(`
          (SELECT GROUP_CONCAT(DISTINCT e.nombre SEPARATOR ', ')
           FROM empresas_contactos ec
           JOIN empresas e ON e.id_empresa = ec.id_empresa
           WHERE ec.id_contacto = c.id_contacto
          ) as nombreEmpresas
        `),
      )
      .orderBy("c.nombre_contacto");

    if (filters.idsContacto) {
      const ids = Array.isArray(filters.idsContacto)
        ? filters.idsContacto
        : [filters.idsContacto];
      query.whereIn("c.id_contacto", filters.idsContacto);
    }

    if (filters.nombre) {
      query.where("c.nombre_contacto", "like", `%${filters.nombre}%`);
    }

    if (filters.apellido) {
      query.where("c.apellido1", "like", `%${filters.apellido}%`);
    }

    if (filters.idsEmpresa) {
      const ids = Array.isArray(filters.idsEmpresa)
        ? filters.idsEmpresa
        : [filters.idsEmpresa];

      query.whereExists(function () {
        this.select(db.raw("1"))
          .from("empresas_contactos as ec")
          .whereRaw("ec.id_contacto = c.id_contacto")
          .whereIn("ec.id_empresa", ids);
      });
    }

    if (filters.idsEdificio) {
      const ids = Array.isArray(filters.idsEdificio)
        ? filters.idsEdificio
        : [filters.idsEdificio];

      query.whereExists(function () {
        this.select(db.raw("1"))
          .from("edificios_contactos as edc")
          .whereRaw("edc.id_contacto = c.id_contacto")
          .whereIn("edc.id_edificio", ids);
      });
    }

    if (!filters.mostrarBaja || filters.mostrarBaja === "0") {
      query.whereNull("c.fecha_baja");
    }

    return applyPagination(query, filters);
  }

  static async getById({ idContacto }) {
    return (
      db("contactos as c")
        .select(
          db.ref("c.id_contacto").as("id"),
          db.ref("c.nombre_contacto").as("nombre"),
          "c.apellido1",
          "c.apellido2",
          db.ref("c.num_identificativo").as("dni"),
          "c.telefono",
          "c.telefono2",
          "c.email",
          "c.email2",
          "c.direccion",
          "c.observaciones",
          "c.fecha_baja",

          // Empresas como array
          db.raw(`
          (
          SELECT COALESCE (
            JSON_ARRAYAGG(
              JSON_OBJECT(
                'id', t.id_empresa,
                'nombre', t.nombre
              )
            ), JSON_ARRAY() )
          FROM (
            SELECT DISTINCT 
              e.id_empresa,
              e.nombre
            FROM empresas_contactos ec
            JOIN empresas e 
            ON e.id_empresa = ec.id_empresa
            WHERE ec.id_contacto = c.id_contacto
          ) t
          ) as empresas
        `),

          // Complejos como array
          db.raw(`
          (
          SELECT COALESCE(
            JSON_ARRAYAGG(
              JSON_OBJECT(
                'id', t.id_edificio,
                'nombre', t.nombre
              )
            ),
          JSON_ARRAY() )
        
          FROM (
            SELECT DISTINCT 
              ed.id_edificio,
              ed.nombre
            FROM edificios_contactos edc
            JOIN edificios ed 
            ON ed.id_edificio = edc.id_edificio
            WHERE edc.id_contacto = c.id_contacto
          ) t
          ) as complejos
        `),
        )
        .where("id_contacto", idContacto)
        .first() ?? null
    );
  }

  static async create(input) {
    const [idContacto] = await db("contactos").insert({
      nombre_contacto: input.nombre,
      apellido1: input.apellido1,
      apellido2: input.apellido2,
      num_identificativo: input.dni,
      telefono: input.telefono,
      telefono2: input.telefono2,
      email: input.email,
      email2: input.email2,
      direccion: input.direccion,
      observaciones: input.observaciones,
    });

    await db("empresas_contactos").insert({
      id_contacto: idContacto,
      id_empresa: input.empresa.id,
    });

    if (input.complejos)
      await this._asignarComplejos(idContacto, input.complejos);

    const contacto = await db("contactos")
      .select("*")
      .where("id_contacto", idContacto)
      .first();

    return contacto ?? null;
  }

  static async update({ idContacto, input }) {
    await db("contactos").where("id_contacto", idContacto).update({
      nombre_contacto: input.nombre,
      apellido1: input.apellido1,
      apellido2: input.apellido2,
      num_identificativo: input.dni,
      telefono: input.telefono,
      telefono2: input.telefono2,
      email: input.email,
      email2: input.email2,
      direccion: input.direccion,
      observaciones: input.observaciones,
    });

    if (input.complejos)
      await this._asignarComplejos(idContacto, input.complejos);

    return db("contactos").where("id_contacto", idContacto).first() ?? null;
  }

  static async delete({ idContactos }) {
    const affectedRows = await db("contactos")
      .whereIn("id_contacto", idContactos)
      .update({
        fecha_baja: db.fn.now(),
      });

    if (affectedRows === 0) {
      return null;
    }

    return db("contactos")
      .select(
        "id_contacto",
        "nombre_contacto",
        "apellido1",
        "apellido2",
        "fecha_baja",
      )
      .whereIn("id_contacto", idContactos);
  }

  // ============================================
  // MÉTODOS PRIVADOS
  // ============================================

  static async _asignarComplejos(idContacto, complejos) {
    await db("edificios_contactos").where("id_contacto", idContacto).del();

    const rows = complejos.map((c) => ({
      id_contacto: idContacto,
      id_edificio: c.id,
    }));

    await db("edificios_contactos").insert(rows);

    return db("edificios_contactos").where("id_contacto", idContacto);
  }
}

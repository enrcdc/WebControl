import { db } from "../config/database.js";
import { applyPagination } from "../utils/index.js";

// TODO: Faltan más operaciones CRUD

export class ContactoModel {
  /**
   *
   * getAll recupera todos los registros según los filtros proporcionados.
   * Si no se especifica un filtro, devuelve todos los registros.
   * @param {Object} filters - El objeto de filtros.
   * @param {string} [filters.idContacto] - filtrar por id
   * @param {string} [filters.nombre] - filtrar por nombre
   * @param {string} [filters.apellido] - filtrar por apellido
   * @param {string} [filters.empresa] - filtrar por nombre de empresa
   * @param {string} [filters.idEmpresa] - filtrar por id de empresa
   * @returns {Promise<Array>} Array de resultados de filtrado
   */
  static async getAll(filters = {}) {
    const query = db("contactos as c")
      .select(
        db.ref("c.id_contacto").as("id"),
        db.ref("c.nombre_contacto").as("nombre"),
        "c.apellido1",
        "c.apellido2",
        db.ref("e.nombre").as("nombre_empresa"),
      )
      .leftJoin("empresas_contactos as ec", "c.id_contacto", "ec.id_contacto")
      .leftJoin("empresas as e", "ec.id_empresa", "e.id_empresa")
      .orderBy("c.nombre_contacto");

    if (filters.idContacto) {
      query.where("c.id_contacto", filters.idContacto);
    }

    if (filters.nombre) {
      query.where("c.nombre_contacto", "like", `%${filters.nombre}%`);
    }

    if (filters.apellido) {
      query.where("c.apellido1", "like", `%${filters.apellido}%`);
    }

    // TODO: Comprobar si este filtro se va a necesitar
    if (filters.empresa) {
      query.where("e.nombre", "like", `%${filters.empresa}%`);
    }

    if (filters.idEmpresa) {
      query.where("ec.id_empresa", filters.idEmpresa);
    }

    return applyPagination(query, filters);
  }

  static async getById({ idContacto }) {
    return (
      db("contactos").select("*").where("id_contacto", idContacto).first() ??
      null
    );
  }

  // TODO: Eliminar cuando el frontend use getAll(filters)
  static async getByEmpresa({ idEmpresa }) {
    return db("contactos as c")
      .select(
        db.ref("c.id_contacto").as("id"),
        db.ref("c.nombre_contacto").as("nombre"),
        "c.apellido1",
        "c.apellido2",
      )
      .leftJoin("empresas_contactos as ec", "c.id_contacto", "ec.id_contacto")
      .where("ec.id_empresa", idEmpresa)
      .orWhere("c.id_contacto", 1)
      .orderBy("c.nombre_contacto");
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

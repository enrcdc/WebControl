import { db } from "../config/database.js";

// TODO: Faltan más operaciones CRUD

export class EmpresaModel {
  /**
   *
   * getAll recupera todos los registros según los filtros proporcionados.
   * Si no se especifica un filtro, devuelve todos los registros.
   * @param {Object} filters - El objeto de filtros.
   * @param {string} [filters.idEmpresa] - filtrar por id
   * @param {string} [filters.nombre] - filtrar por nombre de empresa
   * @returns {Promise<Array>} Array de resultados de filtrado
   */
  static async getAll(filters = {}) {
    const query = db("empresas")
      .select(
        db.ref("id_empresa").as("id"),
        "nombre",
        "direccion",
        "telefono1",
        "email",
      )
      .orderBy("nombre");

    if (filters.idEmpresa) {
      query.where("id_empresa", filters.idEmpresa);
    }

    if (filters.nombre) {
      query.where("nombre", "like", `%${filters.nombre}%`);
    }

    return query;
  }

  // TODO: Eliminar cuando el frontend use getAll(filters)
  static async getByNombre({ nombre }) {
    return db("empresas")
      .select(db.ref("id_empresa").as("id"), "nombre")
      .where("nombre", "like", `%${nombre}%`);
  }

  static async create(input) {
    const [idEmpresa] = await db("empresas").insert({
      nombre: input.nombre,
      cif: input.cif,
      tipo_empresa: input.tipoEmpresa,
      direccion: input.direccion,
      poblacion: input.poblacion,
      provincia: input.provincia,
      cp: input.cp,
      telefono1: input.telefono1,
      telefono2: input.telefono2,
      fax: input.fax,
      email: input.email,
      tipo_factura: input.tipoFactura,
      evaluacion: input.evaluacion,
      observaciones: input.observaciones,
      mostrar_saldo: input.mostrarSaldo,
      pordefecto: input.porDefecto,
    });

    const rows = input.contactos.map((c) => ({
      id_empresa: idEmpresa,
      id_contacto: c,
    }));

    await db("empresas_contactos").insert(rows);

    const empresa = await db("empresas")
      .select("*")
      .where("id_empresa", idEmpresa)
      .first();

    return empresa ?? null;
  }
}

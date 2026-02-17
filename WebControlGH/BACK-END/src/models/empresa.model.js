import { db } from "../config/database.js";
import { applyPagination } from "../utils/index.js";

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
        db.ref("tipo_empresa").as("tipoEmpresa"),
        "telefono1",
        "email",
        db.ref("pordefecto").as("porDefecto"),
        "fecha_baja",
        db.raw(
          "(SELECT COUNT(*) FROM empresas_contactos WHERE empresas_contactos.id_empresa = empresas.id_empresa) as contactosCount",
        ),
      )
      .orderBy("nombre");

    if (filters.idEmpresa) {
      query.where("id_empresa", filters.idEmpresa);
    }

    if (filters.nombre) {
      query.where("nombre", "like", `%${filters.nombre}%`);
    }

    if (filters.tipoEmpresa) {
      query.where("tipo_empresa", filters.tipoEmpresa);
    }

    return applyPagination(query, filters);
  }

  static async getById({ idEmpresa }) {
    return (
      db("empresas")
        .select("*")
        .where("id_empresa", idEmpresa)
        .first() ?? null
    );
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

  static async update({ idEmpresa, input }) {
    await db("empresas").where("id_empresa", idEmpresa).update({
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

    await this._updateContactos(idEmpresa, input.contactos);

    return db("empresas").where("id_empresa", idEmpresa).first() ?? null;
  }

  static async _updateContactos(idEmpresa, contactos) {
    // Borrar las entradas anteriores
    await db("empresas_contactos").where("id_empresa", idEmpresa).del();

    // Sacar filas
    const rows = contactos.map((idContacto) => ({
      id_empresa: idEmpresa,
      id_contacto: idContacto,
    }));

    // Añadir las nuevas entradas
    return db("empresas_contactos").insert(rows);
  }

  // SOFT DELETE. DAR DE BAJA EMPRESAS
  // TODO: Esta operación (junto con la creación y actualización) requeriría permisos especiales
  static async delete({ idEmpresas }) {
    const affectedRows = await db("empresas")
      .whereIn("id_empresa", idEmpresas)
      .update({
        fecha_baja: db.fn.now(),
      });

    if (affectedRows === 0) {
      return null;
    }

    return (
      db("empresas")
        .select("id_empresa", "nombre", "fecha_baja")
        .whereIn("id_empresa", idEmpresas) ?? null
    );
  }
}

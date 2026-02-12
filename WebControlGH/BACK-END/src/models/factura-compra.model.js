import { db } from "../config/database.js";
import { applyPagination } from "../utils/index.js";

export class FacturaCompraModel {
  /**
   * getAll recupera todas las facturas de compra según los filtros proporcionados.
   * Si no se especifica un filtro, devuelve todos los registros.
   * @param {Object} filters - El objeto de filtros.
   * @param {number} [filters.idFactura] - filtrar por id
   * @param {number} [filters.idObra] - filtrar por id de obra
   * @param {string} [filters.codigoObra] - filtrar por código de obra
   * @param {string} [filters.concepto] - filtrar por concepto
   * @param {string} [filters.numFactura] - filtrar por número de factura
   * @param {boolean} [filters.mostrarBaja] - true: solo dadas de baja, false: solo activas
   * @returns {Promise<Array>} Array de resultados de filtrado
   */
  static async getAll(filters = {}) {
    const query = db("facturascompras_obra as f")
      .select(
        "f.id",
        "f.id_obra",
        db.ref("o.codigo_obra").as("codigo_obra"),
        db.ref("fc.Concepto").as("concepto"),
        "f.id_facturascompras",
        db.ref("fc.numero").as("num_factura"),
        "f.importe",
        "f.fecha_alta",
        "f.codigo_usuario_alta",
        "f.fecha_actualizacion",
        "f.fecha_baja",
        "f.codigo_usuario_baja",
        "f.observaciones",
        "f.version",
      )
      .leftJoin("obras as o", "f.id_obra", "o.id_obra")
      .leftJoin("facturascompras as fc", "f.id_facturascompras", "fc.id");

    if (filters.idFactura) {
      query.where("f.id", filters.idFactura);
    }

    if (filters.idObra) {
      query.where("f.id_obra", filters.idObra);
    }

    // TODO: Mirar si este filtro es necesario
    if (filters.codigoObra) {
      query.where("o.codigo_obra", "like", `%${filters.codigoObra}%`);
    }

    if (filters.concepto) {
      query.where("fc.Concepto", "like", `%${filters.concepto}%`);
    }

    if (filters.numFactura) {
      query.where("fc.numero", "like", `%${filters.numFactura}%`);
    }

    if (filters.mostrarBaja !== undefined) {
      if (filters.mostrarBaja === "true" || filters.mostrarBaja === true) {
        query.whereNotNull("f.fecha_baja");
      } else {
        query.whereNull("f.fecha_baja");
      }
    }

    return applyPagination(query, filters);
  }

  static async getById({ id }) {
    return db("facturascompras_obra")
      .select(
        "id",
        "id_obra",
        "id_facturascompras",
        "importe",
        "fecha_alta",
        "codigo_usuario_alta",
        "fecha_actualizacion",
        "fecha_baja",
        "codigo_usuario_baja",
        "observaciones",
        "version",
      )
      .where("id", id)
      .first() ?? null;
  }

  // TODO: Eliminar cuando el frontend use getAll(filters)
  static async getByObra({ idObra }) {
    return db("facturascompras_obra as fo")
      .select(
        "fo.*",
        "fc.Numero",
        "fc.Concepto",
        "u.codigo_firma",
      )
      .leftJoin("facturascompras as fc", "fo.id_facturascompras", "fc.id")
      .leftJoin("usuarios as u", "fo.codigo_usuario_alta", "u.codigo_usuario")
      .where("fo.id_obra", idObra)
      .whereNull("fo.fecha_baja");
  }

  // TODO: Eliminar cuando el frontend use getAll(filters)
  static async getByConcepto({ concepto }) {
    return db("facturascompras")
      .select("id", "Numero", "Concepto")
      .where("Concepto", "like", `%${concepto}%`);
  }

  static async create({ input }) {
    const [insertId] = await db("facturascompras_obra").insert({
      id_obra: input.idObra,
      id_facturascompras: input.idFacturasCompras,
      importe: input.importe,
      fecha_alta: input.fechaAlta,
      codigo_usuario_alta: input.codigoUsuarioAlta,
      fecha_actualizacion: input.fechaActualizacion,
      fecha_baja: input.fechaBaja,
      codigo_usuario_baja: input.codigoUsuarioBaja,
      observaciones: input.observaciones,
      version: input.version,
    });

    return db("facturascompras_obra").where("id", insertId).first() ?? null;
  }

  static async update({ id, input }) {
    if (Object.keys(input).length === 0) {
      const error = new Error("No se proporcionaron campos para actualizar");
      error.name = "EmptyUpdateError";
      throw error;
    }

    const updateData = {};
    if (input.idObra !== undefined) updateData.id_obra = input.idObra;
    if (input.idFacturasCompras !== undefined)
      updateData.id_facturascompras = input.idFacturasCompras;
    if (input.importe !== undefined) updateData.importe = input.importe;
    if (input.fechaAlta !== undefined) updateData.fecha_alta = input.fechaAlta;
    if (input.codigoUsuarioAlta !== undefined)
      updateData.codigo_usuario_alta = input.codigoUsuarioAlta;
    if (input.fechaActualizacion !== undefined)
      updateData.fecha_actualizacion = input.fechaActualizacion;
    if (input.fechaBaja !== undefined) updateData.fecha_baja = input.fechaBaja;
    if (input.codigoUsuarioBaja !== undefined)
      updateData.codigo_usuario_baja = input.codigoUsuarioBaja;
    if (input.observaciones !== undefined)
      updateData.observaciones = input.observaciones;
    if (input.version !== undefined) updateData.version = input.version;

    await db("facturascompras_obra").where("id", id).update(updateData);

    return db("facturascompras_obra").where("id", id).first() ?? null;
  }

  static async delete({ id, codigoUsuarioBaja = 67 } = {}) {
    const affectedRows = await db("facturascompras_obra")
      .where("id", id)
      .update({
        fecha_baja: db.fn.now(),
        codigo_usuario_baja: codigoUsuarioBaja,
      });

    if (affectedRows === 0) {
      return null;
    }

    return db("facturascompras_obra").where("id", id).first() ?? null;
  }
}

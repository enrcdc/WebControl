import { db } from "../config/database.js";
import { applyPagination } from "../utils/index.js";

export class MovimientoAlmacenModel {
  /**
   * getAll recupera todos los movimientos de almacén según los filtros proporcionados.
   * Si no se especifica un filtro, devuelve todos los registros.
   * @param {Object} filters - El objeto de filtros.
   * @param {number} [filters.idMovimiento] - filtrar por id
   * @param {number} [filters.idObra] - filtrar por id de obra
   * @param {number} [filters.idReferencia] - filtrar por id de referencia de almacén
   * @param {string} [filters.tipoMovimiento] - filtrar por tipo de movimiento (like)
   * @param {string} [filters.conceptoMovimiento] - filtrar por concepto de movimiento (like)
   * @param {boolean} [filters.mostrarBaja] - true: solo dados de baja, false: solo activos
   * @returns {Promise<Array>} Array de resultados de filtrado
   */
  static async getAll(filters = {}) {
    const query = db("movimiento_almacen as ma")
      .select(
        "ma.*",
        db.ref("a.codigo").as("codigo_referencia"),
        db.ref("a.descripcion").as("descripcion_referencia"),
        db.ref("u.codigo_firma").as("codigo_firma"),
        db.ref("t.etiqueta").as("tipo_movimiento"),
        db.ref("c.etiqueta").as("concepto_movimiento"),
        db.ref("f.Numero").as("numero_factura"),
      )
      .leftJoin("almacen as a", "ma.id_referencia", "a.id")
      .leftJoin("usuarios as u", "ma.codigo_usuario_alta", "u.codigo_usuario")
      .leftJoin("tipomovimiento as t", "ma.id_tipomovimiento", "t.id")
      .leftJoin("conceptomovimiento as c", "ma.id_conceptomovimiento", "c.id")
      .leftJoin("facturascompras as f", "ma.id_facturascompras", "f.id");

    if (filters.idMovimiento) {
      query.where("ma.id", filters.idMovimiento);
    }

    if (filters.idObra) {
      query.where("ma.id_obra", filters.idObra);
    }

    if (filters.idReferencia) {
      query.where("ma.id_referencia", filters.idReferencia);
    }

    if (filters.tipoMovimiento) {
      query.where("t.etiqueta", "like", `%${filters.tipoMovimiento}%`);
    }

    if (filters.conceptoMovimiento) {
      query.where("c.etiqueta", "like", `%${filters.conceptoMovimiento}%`);
    }

    if (filters.mostrarBaja !== undefined) {
      if (filters.mostrarBaja === "true" || filters.mostrarBaja === true) {
        query.whereNotNull("ma.fecha_baja");
      } else {
        query.whereNull("ma.fecha_baja");
      }
    }

    return applyPagination(query, filters);
  }

  static async getById({ id }) {
    return db("movimiento_almacen").select("*").where("id", id).first() ?? null;
  }

  static async create({ input }) {
    const [insertId] = await db("movimiento_almacen").insert({
      id_referencia: input.idReferencia,
      fecha_alta: input.fechaAlta,
      codigo_usuario_alta: input.usuarioAlta,
      id_tipomovimiento: input.tipoMovimiento,
      id_conceptomovimiento: input.conceptoMovimiento,
      cantidad: input.cantidad,
      importe: input.importe,
      observaciones: input.observaciones,
      id_facturascompras: input.idFactura || null,
      id_obra: input.idObra || null,
      version: 0,
    });

    return db("movimiento_almacen").where("id", insertId).first() ?? null;
  }

  static async update({ id, input }) {
    await db("movimiento_almacen").where("id", id).update({
      fecha_alta: input.fechaMovimiento,
      codigo_usuario_alta: input.usuarioAlta,
      id_tipomovimiento: input.tipoMovimiento,
      id_conceptomovimiento: input.conceptoMovimiento,
      id_obra: input.idObra || null,
      id_facturascompras: input.idFactura || null,
      cantidad: input.cantidad,
      importe: input.importe,
      observaciones: input.observaciones,
    });

    return db("movimiento_almacen").where("id", id).first() ?? null;
  }

  // TODO: De momento el codigo de usuario que da de baja esta hardcodeado
  // Habría que extraer el usuario logeado y asignarle como el que lo da de baja
  static async delete({ id, codigoUsuarioBaja = 67 }) {
    const affectedRows = await db("movimiento_almacen").where("id", id).update({
      fecha_baja: db.fn.now(),
      codigo_usuario_baja: codigoUsuarioBaja,
    });

    if (affectedRows === 0) {
      return null;
    }

    return (
      db("movimiento_almacen")
        .select("id", "fecha_baja", "codigo_usuario_baja")
        .where("id", id)
        .first() ?? null
    );
  }
}

import { db } from "../config/database.js";

export class FacturaObraModel {
  /**
   * getAll recupera todas las facturas de obra según los filtros proporcionados.
   * Si no se especifica un filtro, devuelve todos los registros.
   * @param {Object} filters - El objeto de filtros.
   * @param {number} [filters.idFactura] - filtrar por id
   * @param {Array<number>} [filters.idsObra] - filtrar por ids de obra [Array]
   * @param {string} [filters.codigoFactura] - filtrar por código de factura (like)
   * @param {string} [filters.conceptoLinea] - filtrar por concepto de línea (like)
   * @param {string} [filters.conceptoFactura] - filtrar por concepto de factura (like)
   * @param {string} [filters.codigoPedido] - filtrar por código de pedido (like)
   * @param {boolean} [filters.mostrarBaja] - true: solo dadas de baja, false: solo activas
   * @returns {Promise<Array>} Array de resultados de filtrado
   */
  static async getAll(filters = {}) {
    const query = db("ecofactura as f")
      .select(
        "f.id_factura",
        "f.id_pedido",
        "f.id_obra",
        "f.fecha",
        "f.codigo_factura",
        "f.posicion",
        "f.importe",
        "f.concepto_linea",
        "f.concepto_factura",
        "f.observaciones",
        "f.fecha_cobro",
        "f.fecha_baja",
        "f.codigo_usuario_baja",
        db.ref("p.codigo_pedido").as("codigo_pedido"),
        db.ref("p.posicion").as("posicion_pedido"),
      )
      .leftJoin("ecopedido as p", "f.id_pedido", "p.id_pedido");

    if (filters.idFactura) {
      query.where("f.id_factura", filters.idFactura);
    }

    if (filters.idsObra) {
      query.whereIn("f.id_obra", filters.idsObra);
    }

    if (filters.codigoFactura) {
      query.where(
        "f.codigo_factura",
        "like",
        `%${filters.codigoFactura}%`,
      );
    }

    if (filters.conceptoLinea) {
      query.where("f.concepto_linea", "like", `%${filters.conceptoLinea}%`);
    }

    if (filters.conceptoFactura) {
      query.where(
        "f.concepto_factura",
        "like",
        `%${filters.conceptoFactura}%`,
      );
    }

    if (filters.codigoPedido) {
      query.where("p.codigo_pedido", "like", `%${filters.codigoPedido}%`);
    }

    if (filters.mostrarBaja !== undefined) {
      if (filters.mostrarBaja === "true" || filters.mostrarBaja === true) {
        query.whereNotNull("f.fecha_baja");
      } else {
        query.whereNull("f.fecha_baja");
      }
    }

    return query;
  }

  static async getById({ id }) {
    return (
      db("ecofactura")
        .select("*")
        .where("id_factura", id)
        .first() ?? null
    );
  }

  static async create({ input }) {
    const [insertId] = await db("ecofactura").insert({
      id_pedido: input.idPedido,
      fecha: input.fechaFactura.split("T")[0],
      codigo_factura: input.codigo,
      posicion: input.posicion,
      importe: input.importe,
      concepto_linea: input.conceptoLinea,
      concepto_factura: input.conceptoFactura,
      observaciones: input.observaciones,
      id_obra: input.idObra,
      fecha_cobro: input.cobrado ? input.fechaCobro.split("T")[0] : null,
    });

    return db("ecofactura").where("id_factura", insertId).first() ?? null;
  }

  static async update({ idFactura, input }) {
    await db("ecofactura").where("id_factura", idFactura).update({
      id_pedido: input.idPedido,
      fecha: input.fechaFactura.split("T")[0],
      codigo_factura: input.codigo,
      posicion: input.posicion,
      importe: input.importe,
      concepto_linea: input.conceptoLinea,
      concepto_factura: input.conceptoFactura,
      observaciones: input.observaciones,
      fecha_cobro: input.cobrado ? input.fechaCobro.split("T")[0] : null,
    });

    return db("ecofactura").where("id_factura", idFactura).first() ?? null;
  }

  // TODO: De momento el codigo de usuario que da de baja esta hardcodeado
  // Habría que extraer el usuario logeado y asignarle como el que lo da de baja
  static async delete({ idFactura, codigoUsuarioBaja = 67 }) {
    const affectedRows = await db("ecofactura")
      .where("id_factura", idFactura)
      .update({
        fecha_baja: db.fn.now(),
        codigo_usuario_baja: codigoUsuarioBaja,
      });

    if (affectedRows === 0) {
      return null;
    }

    return (
      db("ecofactura")
        .select("id_factura", "codigo_factura", "fecha_baja", "codigo_usuario_baja")
        .where("id_factura", idFactura)
        .first() ?? null
    );
  }
}

import { db } from "../config/database.js";

export class PedidoObraModel {
  /**
   * getAll recupera todos los pedidos de obra según los filtros proporcionados.
   * Si no se especifica un filtro, devuelve todos los registros.
   * @param {Object} filters - El objeto de filtros.
   * @param {number} [filters.idPedido] - filtrar por id
   * @param {Array<number>} [filters.idsObra] - filtrar por ids de obra [Array]
   * @param {string} [filters.codigoPedido] - filtrar por código de pedido (like)
   * @param {string} [filters.posicion] - filtrar por posición (like)
   * @param {string} [filters.observaciones] - filtrar por observaciones (like)
   * @param {boolean} [filters.mostrarBaja] - true: solo dados de baja, false: solo activos
   * @returns {Promise<Array>} Array de resultados de filtrado
   */
  static async getAll(filters = {}) {
    const query = db("ecopedido").select("*");

    if (filters.idPedido) {
      query.where("id_pedido", filters.idPedido);
    }

    if (filters.idsObra) {
      query.whereIn("id_obra", filters.idsObra);
    }

    if (filters.codigoPedido) {
      query.where("codigo_pedido", "like", `%${filters.codigoPedido}%`);
    }

    if (filters.posicion) {
      query.where("posicion", "like", `%${filters.posicion}%`);
    }

    if (filters.observaciones) {
      query.where("observaciones", "like", `%${filters.observaciones}%`);
    }

    if (filters.mostrarBaja !== undefined) {
      if (filters.mostrarBaja === "true" || filters.mostrarBaja === true) {
        query.whereNotNull("fecha_baja");
      } else {
        query.whereNull("fecha_baja");
      }
    }

    return query;
  }

  static async create({ input }) {
    const [insertId] = await db("ecopedido").insert({
      fecha: input.fechaPedido.split("T")[0],
      codigo_pedido: input.codigoPedido,
      posicion: input.posicion,
      importe: input.importe,
      observaciones: input.observaciones,
      id_obra: input.idObra,
    });

    return db("ecopedido").where("id_pedido", insertId).first() ?? null;
  }

  static async update({ idPedido, input }) {
    await db("ecopedido").where("id_pedido", idPedido).update({
      fecha: input.fechaPedido.split("T")[0],
      codigo_pedido: input.codigoPedido,
      posicion: input.posicion,
      importe: input.importe,
      observaciones: input.observaciones,
    });

    return db("ecopedido").where("id_pedido", idPedido).first() ?? null;
  }

  // TODO: De momento el codigo de usuario que da de baja esta hardcodeado
  // Habría que extraer el usuario logeado y asignarle como el que lo da de baja
  static async delete({ idPedido, codigoUsuarioBaja = 67 }) {
    const affectedRows = await db("ecopedido")
      .where("id_pedido", idPedido)
      .update({
        fecha_baja: db.fn.now(),
        codigo_usuario_baja: codigoUsuarioBaja,
      });

    if (affectedRows === 0) {
      return null;
    }

    return (
      db("ecopedido")
        .select("id_pedido", "codigo_pedido", "fecha_baja", "codigo_usuario_baja")
        .where("id_pedido", idPedido)
        .first() ?? null
    );
  }
}

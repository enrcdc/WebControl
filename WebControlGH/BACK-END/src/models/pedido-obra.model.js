import { pool } from "../config/database.js";

export class PedidoObraModel {
  static async getById({ id }) {
    const [rows] = await pool.query(
      "SELECT * FROM ecopedido WHERE id_pedido = ?",
      [id],
    );
    return rows[0] ?? null;
  }

  static async getByObras({ idsObras }) {
    const placeholder = idsObras.map(() => "?").join(", ");
    const query = `
      SELECT *
      FROM ecopedido
      WHERE id_obra IN (${placeholder}) AND fecha_baja IS NULL`;

    const [result] = await pool.query(query, idsObras);
    return result;
  }

  static async create({ input }) {
    const insertQuery = `
      INSERT INTO ecopedido (
        fecha,
        codigo_pedido,
        posicion,
        importe,
        observaciones,
        id_obra
      )
      VALUES (?, ?, ?, ?, ?, ?)`;

    const values = [
      input.fechaPedido.split("T")[0],
      input.codigoPedido,
      input.posicion,
      input.importe,
      input.observaciones,
      input.idObra,
    ];

    const [result] = await pool.query(insertQuery, values);

    const [rows] = await pool.query(
      "SELECT * FROM ecopedido WHERE id_pedido = ?",
      [result.insertId],
    );

    return rows[0] ?? null;
  }

  static async update({ idPedido, input }) {
    const values = [
      input.fechaPedido.split("T")[0],
      input.codigoPedido,
      input.posicion,
      input.importe,
      input.observaciones,
    ];

    const query = `
      UPDATE ecopedido
      SET
        fecha = ?,
        codigo_pedido = ?,
        posicion = ?,
        importe = ?,
        observaciones = ?
      WHERE id_pedido = ?`;

    await pool.query(query, [...values, idPedido]);

    const [rows] = await pool.query(
      "SELECT * FROM ecopedido WHERE id_pedido = ?",
      [idPedido],
    );

    return rows[0] ?? null;
  }

  // TODO: De momento el codigo de usuario que da de baja esta hardcodeado 
  // Habría que extraer el usuario logeado y asignarle como el que lo da de baja
  static async delete({ idPedido, codigoUsuarioBaja = 67 }) {
    const query = `
      UPDATE ecopedido
      SET
        fecha_baja = NOW(),
        codigo_usuario_baja = ?
      WHERE id_pedido = ?`;

    await pool.query(query, [codigoUsuarioBaja, idPedido]);

    const [rows] = await pool.query(
      `SELECT id_pedido, codigo_pedido, fecha_baja, codigo_usuario_baja
       FROM ecopedido
       WHERE id_pedido = ?`,
      [idPedido],
    );

    return rows[0] ?? null;
  }
}

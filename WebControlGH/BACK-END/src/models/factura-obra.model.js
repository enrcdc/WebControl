import { pool } from "../config/database.js";

export class FacturaObraModel {
  static async getById({ id }) {
    const [rows] = await pool.query(
      "SELECT * FROM ecofactura WHERE id_factura = ?",
      [id],
    );
    return rows[0] ?? null;
  }

  static async getByObras({ idsObras }) {
    const placeholders = idsObras.map(() => "?").join(", ");
    const query = `
      SELECT
        f.*,
        p.codigo_pedido,
        p.posicion AS posicion_pedido
      FROM ecofactura AS f
      LEFT JOIN ecopedido AS p ON f.id_pedido = p.id_pedido
      WHERE f.id_obra IN (${placeholders}) AND f.fecha_baja IS NULL`;

    const [result] = await pool.query(query, idsObras);
    return result;
  }

  static async create({ input }) {
    const insertQuery = `
      INSERT INTO ecofactura (
        id_pedido,
        fecha,
        codigo_factura,
        posicion,
        importe,
        concepto_linea,
        concepto_factura,
        observaciones,
        id_obra,
        fecha_cobro
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    const values = [
      input.idPedido,
      input.fechaFactura.split("T")[0],
      input.codigo,
      input.posicion,
      input.importe,
      input.conceptoLinea,
      input.conceptoFactura,
      input.observaciones,
      input.idObra,
      input.cobrado ? input.fechaCobro.split("T")[0] : null,
    ];

    const [result] = await pool.query(insertQuery, values);

    const [rows] = await pool.query(
      "SELECT * FROM ecofactura WHERE id_factura = ?",
      [result.insertId],
    );

    return rows[0] ?? null;
  }

  static async update({ idFactura, input }) {
    const values = [
      input.idPedido,
      input.fechaFactura.split("T")[0],
      input.codigo,
      input.posicion,
      input.importe,
      input.conceptoLinea,
      input.conceptoFactura,
      input.observaciones,
      input.cobrado ? input.fechaCobro.split("T")[0] : null,
    ];

    const query = `
      UPDATE ecofactura
      SET
        id_pedido = ?,
        fecha = ?,
        codigo_factura = ?,
        posicion = ?,
        importe = ?,
        concepto_linea = ?,
        concepto_factura = ?,
        observaciones = ?,
        fecha_cobro = ?
      WHERE id_factura = ?`;

    await pool.query(query, [...values, idFactura]);

    const [rows] = await pool.query(
      "SELECT * FROM ecofactura WHERE id_factura = ?",
      [idFactura],
    );

    return rows[0] ?? null;
  }

  // TODO: De momento el codigo de usuario que da de baja esta hardcodeado
  // Habría que extraer el usuario logeado y asignarle como el que lo da de baja
  static async delete({ idFactura, codigoUsuarioBaja = 67 }) {
    const query = `
      UPDATE ecofactura
      SET
        fecha_baja = NOW(),
        codigo_usuario_baja = ?
      WHERE id_factura = ?`;

    await pool.query(query, [codigoUsuarioBaja, idFactura]);

    const [rows] = await pool.query(
      `SELECT id_factura, codigo_factura, fecha_baja, codigo_usuario_baja
       FROM ecofactura
       WHERE id_factura = ?`,
      [idFactura],
    );

    return rows[0] ?? null;
  }
}

import { pool } from "../config/database.js";

export class MovimientoAlmacenModel {
  static async getById({ id }) {
    const [rows] = await pool.query(
      "SELECT * FROM movimiento_almacen WHERE id = ?",
      [id],
    );
    return rows[0] ?? null;
  }

  static async getByObra({ idObra }) {
    const query = `
      SELECT
        ma.*,
        a.codigo AS codigo_referencia,
        a.descripcion AS descripcion_referencia,
        u.codigo_firma,
        t.etiqueta AS tipo_movimiento,
        c.etiqueta AS concepto_movimiento,
        f.Numero AS numero_factura
      FROM movimiento_almacen AS ma
      LEFT JOIN almacen AS a ON ma.id_referencia = a.id
      LEFT JOIN usuarios AS u ON ma.codigo_usuario_alta = u.codigo_usuario
      LEFT JOIN tipomovimiento AS t ON ma.id_tipomovimiento = t.id
      LEFT JOIN conceptomovimiento AS c ON ma.id_conceptomovimiento = c.id
      LEFT JOIN facturascompras AS f ON ma.id_facturascompras = f.id
      WHERE ma.id_obra = ? AND ma.fecha_baja IS NULL`;

    const [result] = await pool.query(query, [idObra]);
    return result;
  }

  static async create({ input }) {
    const insertQuery = `
      INSERT INTO movimiento_almacen (
        id_referencia,
        fecha_alta,
        codigo_usuario_alta,
        id_tipomovimiento,
        id_conceptomovimiento,
        cantidad,
        importe,
        observaciones,
        id_facturascompras,
        id_obra,
        version
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0)`;

    const values = [
      input.idReferencia,
      input.fechaAlta,
      input.usuarioAlta,
      input.tipoMovimiento,
      input.conceptoMovimiento,
      input.cantidad,
      input.importe,
      input.observaciones,
      input.idFactura || null,
      input.idObra || null,
    ];

    const [result] = await pool.query(insertQuery, values);

    const [rows] = await pool.query(
      "SELECT * FROM movimiento_almacen WHERE id = ?",
      [result.insertId],
    );

    return rows[0] ?? null;
  }

  static async update({ id, input }) {
    const query = `
      UPDATE movimiento_almacen
      SET
        fecha_alta = ?,
        codigo_usuario_alta = ?,
        id_tipomovimiento = ?,
        id_conceptomovimiento = ?,
        id_obra = ?,
        id_facturascompras = ?,
        cantidad = ?,
        importe = ?,
        observaciones = ?
      WHERE id = ?`;

    const values = [
      input.fechaMovimiento,
      input.usuarioAlta,
      input.tipoMovimiento,
      input.conceptoMovimiento,
      input.idObra || null,
      input.idFactura || null,
      input.cantidad,
      input.importe,
      input.observaciones,
    ];

    await pool.query(query, [...values, id]);

    const [rows] = await pool.query(
      "SELECT * FROM movimiento_almacen WHERE id = ?",
      [id],
    );

    return rows[0] ?? null;
  }

  // TODO: De momento el codigo de usuario que da de baja esta hardcodeado
  // Habría que extraer el usuario logeado y asignarle como el que lo da de baja
  static async delete({ id, codigoUsuarioBaja = 67 }) {
    const query = `
      UPDATE movimiento_almacen
      SET
        fecha_baja = NOW(),
        codigo_usuario_baja = ?
      WHERE id = ?`;

    await pool.query(query, [codigoUsuarioBaja, id]);

    const [rows] = await pool.query(
      `SELECT id, fecha_baja, codigo_usuario_baja
       FROM movimiento_almacen
       WHERE id = ?`,
      [id],
    );

    return rows[0] ?? null;
  }
}

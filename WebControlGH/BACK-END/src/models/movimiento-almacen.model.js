import db from "../config/database.js";

// TODO: ZOD PARA VALIDACION
export class MovimientosAlmacenModel {
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
        FROM
            movimiento_almacen AS ma
        LEFT JOIN
            almacen AS a ON ma.id_referencia = a.id
        LEFT JOIN
            usuarios AS u ON ma.codigo_usuario_alta = u.codigo_usuario
        LEFT JOIN
            tipomovimiento AS t ON ma.id_tipomovimiento = t.id
        LEFT JOIN
            conceptomovimiento AS c ON ma.id_conceptomovimiento = c.id
        LEFT JOIN 
            facturascompras AS f ON ma.id_facturascompras = f.id
        WHERE
            ma.id_obra = ? AND ma.fecha_baja IS NULL`;

    const [result] = await db.query(query, [idObra]);
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

    const [result] = await db.query(insertQuery, values);

    const [rows] = await db.query(
      `
          SELECT *
          FROM movimiento_almacen
          WHERE id = ?`,
      [result.insertId]
    );

    return rows[0] ?? null;
  }

  static async update({ idMovimiento, input }) {
    const camposPermitidos = {
      fechaMovimiento: "fecha_alta",
      usuarioAlta: "codigo_usuario_alta",
      tipoMovimiento: "id_tipomovimiento",
      conceptoMovimiento: "id_conceptomovimiento",
      idObra: "id_obra",
      idFactura: "id_facturascompras",
      cantidad: "cantidad",
      importe: "importe",
      observaciones: "observaciones",
    };

    // Filtrar solo lo que aparece en el input
    const sets = [];
    const values = [];

    Object.entries(camposPermitidos).forEach(([inputField, dbField]) => {
      if (input[inputField] !== undefined) {
        sets.push(`${dbField} = ?`);
        values.push(input[inputField]);
      }
    });

    const query = `
    UPDATE movimiento_almacen
    SET ${sets.join(", ")}
    WHERE id = ?`;

    await db.query(query, [...values, idMovimiento]);

    const [rows] = await db.query(
      `SELECT * FROM movimiento_almacen WHERE id = ?`,
      [idMovimiento]
    );

    return rows[0] ?? null;
  }

  // De momento, hasta que no se obtenga la información del usuario logeado,
  // el codigo del usuario que da de baja el movimiento será 67 por defecto
  // (usuario abaco_andres)
  static async delete({ idMovimiento, codigoUsuarioBaja = 67 } = {}) {
    const query = `
    UPDATE movimiento_almacen
    SET
      fecha_baja = NOW(),
      codigo_usuario_baja = ?
    WHERE id = ?
    `;

    const [result] = await db.query(query, [codigoUsuarioBaja, idMovimiento]);

    if (result.affectedRows === 0) {
      return null;
    }

    const [rows] = await db.query(
      `
      SELECT
        id,
        fecha_baja,
        codigo_usuario_baja
      FROM movimiento_almacen
      WHERE id = ?
      `,
      [idMovimiento]
    );

    return rows[0] ?? null;
  }
}

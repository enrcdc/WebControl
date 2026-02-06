import db from "../config/database.js";

export class EcoPedidoModel {
  static async getByObras({ idsObras }) {
    const placeholder = idsObras.map(() => "?").join(", ");
    const query = `
    SELECT *
    FROM
        ecopedido
    WHERE id_obra IN (${placeholder}) AND fecha_baja IS NULL`;

    const [result] = await db.query(query, idsObras);
    return result;
  }

  // TODO: FALTA UN ZOD PARA VALIDAR LOS PEDIDOS
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

    const [result] = await db.query(insertQuery, values);

    const [rows] = await db.query(
      `
      SELECT *
      FROM ecopedido
      WHERE id_pedido = ?`,
      [result.insertId]
    );

    return rows[0] ?? null;
  }

  // TODO: FALTA UN ZOD PARA VALIDAR
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

    await db.query(query, [...values, idPedido]);

    const [rows] = await db.query(
      `SELECT * FROM ecopedido WHERE id_pedido = ?`,
      [idPedido]
    );

    return rows[0] ?? null;
  }
  // De momento, hasta que no se obtenga la información del usuario logeado,
  // el codigo del usuario que da de baja la factura será 67 por defecto
  // (usuario abaco_andres)
  static async delete({ idPedido, codigoUsuarioBaja = 67 } = {}) {
    const query = `
    UPDATE ecopedido
    SET
      fecha_baja = NOW(),
      codigo_usuario_baja = ?
    WHERE id_pedido  = ?
    `;

    const [result] = await db.query(query, [codigoUsuarioBaja, idPedido]);

    if (result.affectedRows === 0) {
      return null;
    }

    const [rows] = await db.query(
      `
      SELECT
        id_pedido,
        codigo_pedido,
        fecha_baja,
        codigo_usuario_baja
      FROM ecopedido
      WHERE id_pedido = ?
      `,
      [idPedido]
    );

    return rows[0] ?? null;
  }
}

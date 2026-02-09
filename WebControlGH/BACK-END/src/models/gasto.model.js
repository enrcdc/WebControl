import { pool } from "../config/database.js";

export class GastoModel {
  static async getAllGastosPorValidar() {
    const query = `
        SELECT
            g.*,
            u.codigo_firma AS usuario_alta,
            o.codigo_obra,
            o.descripcion_obra,
            tg.descripcion AS descripcion_gasto,
            u2.codigo_firma AS usuario_validacion,
            u3.codigo_firma AS usuario_pago
        FROM 
            gastosobra AS g
        LEFT JOIN 
            obras AS o ON g.id_obra = o.id_obra
        LEFT JOIN
            tipogasto AS tg ON g.id_tipogasto = tg.id_tipogasto
        LEFT JOIN 
            usuarios AS u ON g.codigo_usuario = u.codigo_usuario
        LEFT JOIN
            usuarios AS u2 ON g.codigo_usuario_validacion = u2.codigo_usuario
        LEFT JOIN
            usuarios AS u3 ON g.codigo_usuario_pago = u3.codigo_usuario
        WHERE g.codigo_usuario_validacion IS NULL`;

    const [result] = await pool.query(query);
    return result;
  }

  static async getAllGastosPorPagar() {
    const query = `
        SELECT
            g.*,
            u.codigo_firma AS usuario_alta,
            o.codigo_obra,
            o.descripcion_obra,
            tg.descripcion AS descripcion_gasto,
            u2.codigo_firma AS usuario_validacion,
            u3.codigo_firma AS usuario_pago
        FROM 
            gastosobra AS g
        LEFT JOIN 
            obras AS o ON g.id_obra = o.id_obra
        LEFT JOIN
            tipogasto AS tg ON g.id_tipogasto = tg.id_tipogasto
        LEFT JOIN 
            usuarios AS u ON g.codigo_usuario = u.codigo_usuario
        LEFT JOIN
            usuarios AS u2 ON g.codigo_usuario_validacion = u2.codigo_usuario
        LEFT JOIN
            usuarios AS u3 ON g.codigo_usuario_pago = u3.codigo_usuario
        WHERE g.codigo_usuario_pago IS NULL`;

    const [result] = await pool.query(query);
    return result;
  }

  // TODO: Debería funcionar mejor con los códigos de obra en lugar de con el id
  // Puede recibir varios IDs. Necesario para las obras subordinadas
  static async getGastosByObra({ idsObra }) {
    const placeholders = idsObra.map(() => "?").join(", ");
    const query = `
        SELECT
            g.fecha_gasto,
            u.codigo_firma AS usuario_alta,
            tg.descripcion AS descripcion_gasto,
            g.fecha_validacion,
            u2.codigo_firma AS usuario_validacion,
            g.pagado_visa,
            g.fecha_pago,
            g.cantidad,
            g.importe,
            g.observaciones
        FROM
            gastosobra AS g
        LEFT JOIN 
            usuarios AS u ON g.codigo_usuario = u.codigo_usuario
        LEFT JOIN
            usuarios AS u2 ON g.codigo_usuario_validacion = u2.codigo_usuario
        LEFT JOIN
            tipogasto AS tg ON g.id_tipogasto = tg.id_tipogasto
        WHERE g.id_obra IN (${placeholders})`;

    const [result] = await pool.query(query, idsObra);
    return result;
  }

  // Puede recibir varios IDs. Necesario para las obras subordinadas
  static async getHorasExtraByObra({ idsObra }) {
    const placeholders = idsObra.map(() => "?").join(", ");
    const query = `
    SELECT
        g.fecha_gasto,
        u.codigo_firma AS usuario,
        tg.descripcion,
        g.fecha_validacion,
        u2.codigo_firma AS usuario_validacion,
        g.pagado_visa,
        g.fecha_pago,
        g.cantidad,
        g.importe
    FROM
        gastosobra AS g
    LEFT JOIN
        tipogasto AS tg ON g.id_tipogasto = tg.id_tipogasto
    LEFT JOIN
        usuarios AS u ON g.codigo_usuario = u.codigo_usuario
    LEFT JOIN
        usuarios AS u2 ON g.codigo_usuario = u2.codigo_usuario
    WHERE
        tg.descripcion = 'Hora Extra' AND g.id_obra IN (${placeholders})`;

    const [result] = await pool.query(query, idsObra);
    return result;
  }
}

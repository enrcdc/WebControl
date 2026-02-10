import { pool } from "../config/database.js";

// TODO: Hay que darle una vuelta a este modelo.
// La creación de una entrada en la tabla de rentabilidad debe estar asociada 
// a una obra recién creada.
// La actualización de una entrada en la tabla de rentabilidad debe estar asociada 
// a la actualización de los datos de una obra existente


export class RentabilidadModel {
  static async getByIdObra({ idObra }) {
    const query = `
    SELECT 
      r.*,
      o.horas_previstas,
      o.gasto_previsto,
      o.importe,
      (
        SELECT SUM(ma.importe * ma.cantidad)
        FROM movimiento_almacen AS ma
        WHERE ma.id_obra = r.id_obra
      ) AS gastos_almacen,
      (
        SELECT SUM(fc.importe)
        FROM facturascompras_obra AS fc
        WHERE fc.id_obra = r.id_obra
      ) AS gastos_compras
    FROM
      rentabilidad AS r
    LEFT JOIN
      obras AS o ON r.id_obra = o.id_obra
    WHERE r.id_obra = ?
  `;

    const [result] = await pool.query(query, [idObra]);
    return result[0] ?? null;
  }
}

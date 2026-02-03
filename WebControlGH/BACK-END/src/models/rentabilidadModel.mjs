import db from "../database.js";

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

    const [result] = await db.query(query, [idObra]);
    return result[0] ?? null;
  }
}

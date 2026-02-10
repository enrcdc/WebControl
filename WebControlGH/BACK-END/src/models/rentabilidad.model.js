import { db } from "../config/database.js";

// TODO: Hay que darle una vuelta a este modelo.
// La creación de una entrada en la tabla de rentabilidad debe estar asociada
// a una obra recién creada.
// La actualización de una entrada en la tabla de rentabilidad debe estar asociada
// a la actualización de los datos de una obra existente

export class RentabilidadModel {
  static async getByIdObra({ idObra }) {
    const result = await db("rentabilidad as r")
      .select(
        "r.*",
        "o.horas_previstas",
        "o.gasto_previsto",
        "o.importe",
        db.raw(
          "(SELECT SUM(ma.importe * ma.cantidad) FROM movimiento_almacen AS ma WHERE ma.id_obra = r.id_obra) AS gastos_almacen",
        ),
        db.raw(
          "(SELECT SUM(fc.importe) FROM facturascompras_obra AS fc WHERE fc.id_obra = r.id_obra) AS gastos_compras",
        ),
      )
      .leftJoin("obras as o", "r.id_obra", "o.id_obra")
      .where("r.id_obra", idObra)
      .first();

    return result ?? null;
  }
}

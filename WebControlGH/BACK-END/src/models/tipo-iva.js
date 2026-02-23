import { db } from "../config/database.js";

export class TipoIvaModel {
  static async getAll() {
    return db("tipoiva")
      .select(
        db.ref("id_tipoiva").as("id"),
        "descripcion",
        "porcentaje",
      )
      .orderBy("porcentaje");
  }
}

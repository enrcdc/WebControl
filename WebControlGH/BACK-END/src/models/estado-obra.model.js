import { db } from "../config/database.js";

export class EstadoObraModel {
  static async getAll() {
    return db("tipoestadosobras")
      .select("codigo_estado", "descripcion_estado", "orden")
      .orderBy("codigo_estado");
  }
}

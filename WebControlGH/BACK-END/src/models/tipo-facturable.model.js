import { db } from "../config/database.js";

export class TipoFacturableModel {
  static async getAll() {
    return db("tipofacturable")
      .select("id_tipo", "descripcion")
      .orderBy("id_tipo");
  }
}

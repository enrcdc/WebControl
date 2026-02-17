import { db } from "../config/database.js";

export class TipoFacturaModel {
  static async getAll() {
    return db("tiposfactura")
      .select("id", "Descripcion")
      .where("CodEmp", "00004")
      .orderBy("Descripcion");
  }
}

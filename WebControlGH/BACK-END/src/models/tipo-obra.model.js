import { db } from "../config/database.js";

// TODO: Faltan dos modelos más. Los proveedores (Operaciones CRUD Completas)
// y los tipos de gastos (Operaciones CRUD completas)

export class TipoObraModel {
  static async getAll() {
    return db("tipoobra")
      .select("id_tipo", "descripcion", "orden")
      .orderBy("id_tipo");
  }
}

import db from "../config/database.js";

export class TipoObraModel {
  static async getAll() {
    const query = `
    SELECT 
        id_tipo,
        descripcion,
        orden
    FROM tipoobra
    ORDER BY id_tipo`;

    const [result] = await db.query(query);
    return result;
  }
}

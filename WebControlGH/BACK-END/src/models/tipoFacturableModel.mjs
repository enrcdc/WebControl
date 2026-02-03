import db from "../database.js";

export class TipoFacturableModel {
  static async getAll() {
    const query = `
    SELECT 
        id_tipo,
        descripcion
    FROM tipofacturable
    ORDER BY id_tipo`;

    const [result] = await db.query(query);
    return result;
  }
}

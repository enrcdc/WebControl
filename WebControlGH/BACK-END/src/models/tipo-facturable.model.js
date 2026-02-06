import { pool } from "../config/database.js";

export class TipoFacturableModel {
  static async getAll() {
    const query = `
    SELECT 
        id_tipo,
        descripcion
    FROM tipofacturable
    ORDER BY id_tipo`;

    const [result] = await pool.query(query);
    return result;
  }
}

import db from "../database.js";

// MODELO DE NEGOCIO PARA LOS EDIFICIOS
export class EdificioModel {
  static async getAll() {
    const query = `
    SELECT
        id_edificio,
        nombre
    FROM edificios
    ORDER BY nombre`;

    const [result] = await db.query(query);
    return result;
  }
}

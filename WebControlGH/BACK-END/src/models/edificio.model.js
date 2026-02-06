import { pool } from "../config/database.js";

// MODELO DE NEGOCIO PARA LOS EDIFICIOS
export class EdificioModel {
  static async getAll() {
    const query = `
    SELECT
        id_edificio AS id,
        nombre
    FROM edificios
    ORDER BY nombre`;

    const [result] = await pool.query(query);
    return result;
  }

  static async getByNombre({ nombre }) {
    const query = `
    SELECT
      id_edificio AS id,
      nombre
    FROM edificios 
    WHERE nombre LIKE CONCAT('%', ?, '%')`;
    const [result] = await pool.query(query, nombre);
    return result;
  }
}

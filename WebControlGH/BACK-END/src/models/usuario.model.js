import { pool } from "../config/database.js";

// TODO: Faltan más operaciones CRUD

export class UsuarioModel {
  static async getAll() {
    const query = `
      SELECT
        codigo_usuario,
        usuario_bonita AS nombre_usuario,
        nombre,
        apellido1,
        apellido2,
        codigo_firma
      FROM usuarios
      ORDER BY codigo_firma`;

    const [result] = await pool.query(query);
    return result;
  }

  static async getByUsername({ username }) {
    const query = `
      SELECT
        usuario_bonita AS nombre_usuario,
        password,
        codigo_usuario,
        nombre,
        apellido1,
        apellido2
      FROM usuarios
      WHERE usuario_bonita = ?
      LIMIT 1`;

    const [rows] = await pool.query(query, [username]);
    return rows[0] ?? null;
  }
}

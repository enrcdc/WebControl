import { pool } from "../config/database.js";

// TODO: Faltan más operaciones CRUD. Cada vez que se asigne un responsable a un
// usuario, hay que crear una entrada en la tabla responsables.
export class ResponsableModel {
  static async getSubordinadosByManager({ codigoManager }) {
    const query = `
      SELECT u.*
      FROM usuarios AS u
      JOIN responsables AS r ON u.codigo_usuario = r.cod_usuario
      WHERE r.cod_usuario_manager = ?
      ORDER BY u.nombre, u.apellido1`;

    const [rows] = await pool.query(query, [codigoManager]);
    return rows;
  }
}

import { pool } from "../config/database.js";

// MODELO DE NEGOCIO PARA LOS ESTADOS DE OBRA
export class EstadoObraModel {
  static async getAll() {
    const query = `
    SELECT
        codigo_estado,
        descripcion_estado,
        orden
    FROM tipoestadosobras
    ORDER BY codigo_estado`;

    const [result] = await pool.query(query);
    return result;
  }
}

import { pool } from "../config/database.js";

export class RelacionObraModel {
  static async getObraPadre({ idObra }) {
    const query = `
      SELECT
        r.id_obraPadre,
        o.codigo_obra,
        o.descripcion_obra
      FROM relacionobras AS r
      LEFT JOIN obras AS o ON r.id_obraPadre = o.id_obra
      WHERE r.id_obraHija = ?`;

    const [result] = await pool.query(query, [idObra]);
    return result[0] ?? null;
  }

  static async getObrasHijas({ idObra }) {
    const query = `
      SELECT
        r.id_obraHija,
        o.codigo_obra,
        o.descripcion_obra,
        o.horas_previstas,
        o.gasto_previsto,
        o.importe
      FROM relacionobras AS r
      LEFT JOIN obras AS o ON r.id_obraHija = o.id_obra
      WHERE r.id_obraPadre = ?`;

    const [result] = await pool.query(query, [idObra]);
    return result;
  }

  static async deleteRelacionesPadre({ idObraHija }) {
    const query = "DELETE FROM relacionobras WHERE id_obraHija = ?";
    await pool.query(query, [idObraHija]);
  }

  static async insertRelacionPadre({ idObraPadre, idObraHija }) {
    const insertQuery = `
      INSERT INTO relacionobras (id_obraPadre, id_obraHija)
      VALUES (?, ?)`;

    await pool.query(insertQuery, [idObraPadre, idObraHija]);

    const [rows] = await pool.query(
      "SELECT * FROM relacionobras WHERE id_obraPadre = ? AND id_obraHija = ?",
      [idObraPadre, idObraHija],
    );

    return rows[0] ?? null;
  }

  static async deleteRelacionesHijas({ idObraPadre }) {
    const query = "DELETE FROM relacionobras WHERE id_obraPadre = ?";
    await pool.query(query, [idObraPadre]);
  }

  static async insertRelacionesHijas({ idObraPadre, idsObrasHijas }) {
    const insertQuery = `
      INSERT INTO relacionobras (id_obraPadre, id_obraHija)
      VALUES ?`;

    const values = idsObrasHijas.map((idHija) => [idObraPadre, idHija]);
    await pool.query(insertQuery, [values]);

    const [rows] = await pool.query(
      "SELECT * FROM relacionobras WHERE id_obraPadre = ?",
      [idObraPadre],
    );

    return rows;
  }
}

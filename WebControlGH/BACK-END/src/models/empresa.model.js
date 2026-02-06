import db from "../config/database.js";

// MODELO DE NEGOCIO PARA LAS EMPRESAS

export class EmpresaModel {
  static async getAll() {
    const query = `
    SELECT 
        id_empresa AS id,
        nombre,
        direccion,
        telefono1,
        email
    FROM empresas 
    ORDER BY nombre`;
    const [result] = await db.query(query);
    return result;
  }

  static async getByNombre({ nombre }) {
    const query = `
    SELECT
      id_empresa AS id,
      nombre
    FROM empresas
    WHERE nombre LIKE CONCAT('%', ?, '%')`;
    const [result] = await db.query(query, nombre);
    return result;
  }
}

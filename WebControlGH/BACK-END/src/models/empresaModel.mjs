import db from "../database.js";

// MODELO DE NEGOCIO PARA LAS EMPRESAS

export class EmpresaModel {
  static async getAll() {
    const query = `
    SELECT 
        id_empresa,
        nombre,
        direccion,
        telefono1,
        email
    FROM empresas 
    ORDER BY nombre`;
    const [result] = await db.query(query);
    return result;
  }
}

import { pool } from "../config/database.js";

// TODO: Faltan dos modelos más. Los proveedores (Operacioes CRUD Completas)
// y los tipos de gastos (Operaciones CRUD completas)

export class TipoObraModel {
  static async getAll() {
    const query = `
    SELECT 
        id_tipo,
        descripcion,
        orden
    FROM tipoobra
    ORDER BY id_tipo`;

    const [result] = await pool.query(query);
    return result;
  }
}

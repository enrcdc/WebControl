import db from "../config/database.js";

// MODELO DE NEGOCIO PARA LOS CONTACTOS

export class ContactoModel {
  static async getAll() {
    const query = `
    SELECT
        c.id_contacto AS id,
        c.nombre_contacto AS nombre,
        c.apellido1,
        c.apellido2
    FROM contactos AS c
    ORDER BY c.nombre_contacto`;

    const [result] = await db.query(query);
    return result;
  }

  static async getByEmpresa({ idEmpresa }) {
    const query = `
    SELECT
        c.id_contacto AS id,
        c.nombre_contacto AS nombre,
        c.apellido1,
        c.apellido2
    FROM contactos AS c
    LEFT JOIN 
        empresas_contactos AS e_c ON c.id_contacto = e_c.id_contacto
    WHERE
        e_c.id_empresa = ? OR c.id_contacto = 1
    ORDER BY c.nombre_contacto
  `;

    const [result] = await db.query(query, [idEmpresa]);
    return result;
  }

  static async create(input) {
    console.log(input);
    const values = [
      input.nombre,
      input.apellido1,
      input.apellido2,
      input.dni,
      input.telefono,
      input.telefono2,
      input.email,
      input.email2,
      input.direccion,
      input.observaciones,
    ];

    const valuesString = values.map(() => "?").join(", ");

    const query = `
    INSERT INTO contactos (
    nombre_contacto,
    apellido1,
    apellido2,
    num_identificativo,
    telefono,
    telefono2,
    email,
    email2,
    direccion,
    observaciones
    )
    VALUES (${valuesString})`;

    // inserción en la tabla de contactos
    const [result] = await db.query(query, values);

    // inserción en la tabla de empresas-contactos
    await db.query(
      `
      INSERT INTO empresas_contactos (
      id_contacto,
      id_empresa
      )
      VALUES (?, ?)`,
      [result.insertId, input.empresa.id],
    );

    // actualizar la tabla edificios_contactos (si aplica)
    await this.asignarComplejos(result.insertId, input.complejos);

    const [rows] = await db.query(
      `
      SELECT * FROM contactos WHERE id_contacto = ?`,
      [result.insertId],
    );

    return rows[0] ?? null;
  }

  static async asignarComplejos(idContacto, complejos) {
    // Eliminar entradas previas
    const deleteQuery = `DELETE FROM edificios_contactos WHERE id_contacto = ?`;
    await db.query(deleteQuery, [idContacto]);

    if (!Array.isArray(complejos) || complejos.length === 0) return;

    const insertQuery = `
    INSERT INTO edificios_contactos (id_contacto, id_edificio) VALUES ?`;
    const values = complejos.map((c) => [idContacto, c.id]);
    await db.query(insertQuery, [values]);

    // Devolvemos la inserción
    const [rows] = await db.query(
      `
      SELECT *
      FROM edificios_contactos
      WHERE id_contacto = ?
      `,
      [idContacto],
    );

    return rows;
  }
}

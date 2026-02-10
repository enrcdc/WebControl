import { db } from "../config/database.js";

// TODO: Faltan más operaciones CRUD

export class UsuarioModel {
  static async getAll(filters = {}) {
    const query = db("usuarios")
      .select(
        "codigo_usuario",
        db.ref("usuario_bonita").as("nombre_usuario"),
        "nombre",
        "apellido1",
        "apellido2",
        "codigo_firma",
      )
      .orderBy("codigo_firma");

    if (filters.nombre) {
      query.where("nombre", "like", `%${filters.nombre}%`);
    }

    if (filters.apellido) {
      query.where("apellido1", "like", `%${filters.apellido}%`);
    }

    if (filters.codigoFirma) {
      query.where("codigo_firma", "like", `%${filters.codigoFirma}%`);
    }

    return query;
  }

  static async getByUsername({ username }) {
    const user = await db("usuarios")
      .select(
        db.ref("usuario_bonita").as("nombre_usuario"),
        "password",
        "codigo_usuario",
        "nombre",
        "apellido1",
        "apellido2",
      )
      .where("usuario_bonita", username)
      .first();

    return user ?? null;
  }
}

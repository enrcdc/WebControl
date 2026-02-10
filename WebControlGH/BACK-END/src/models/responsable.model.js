import { db } from "../config/database.js";

// TODO: Faltan más operaciones CRUD. Cada vez que se asigne un responsable a un
// usuario, hay que crear una entrada en la tabla responsables.
export class ResponsableModel {
  static async getSubordinadosByManager({ codigoManager }) {
    return db("usuarios as u")
      .join("responsables as r", "u.codigo_usuario", "r.cod_usuario")
      .select(
        "u.codigo_usuario",
        "u.usuario_bonita",
        "u.nombre",
        "u.apellido1",
        "u.apellido2",
        "u.codigo_firma",
      )
      .where("r.cod_usuario_manager", codigoManager)
      .orderBy([{ column: "u.nombre" }, { column: "u.apellido1" }]);
  }
}

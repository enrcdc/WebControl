import db from "../database.js";
import crypto from "crypto";

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

    const [result] = await db.query(query);
    return result;
  }

  static async verifyCredentials(username, plainPassword) {
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

    const [result] = await db.query(query, [username]);

    if (result.length === 0) return null;

    const user = result[0];

    // Hashear la contraseña con MD5
    const hashedPassword = crypto
      .createHash("md5")
      .update(plainPassword)
      .digest("hex");

    // Comparar hashes
    if (hashedPassword !== user.password) return null;

    // NO retornar contraseña
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
}

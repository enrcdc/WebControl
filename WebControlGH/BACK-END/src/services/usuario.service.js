import crypto from "crypto";
import { UsuarioModel } from "../models/usuario.model.js";
import { InvalidDataError, UnauthorizedError } from "../errors/index.js";

export class UsuarioService {
  static async getAll(filters = {}) {
    const usuarios = await UsuarioModel.getAll(filters);
    return usuarios;
  }

  static async login(username, password) {
    if (!username || !password) {
      throw new InvalidDataError("Usuario y contraseña son requeridos", {
        field: "username/password",
      });
    }

    const usuario = await UsuarioModel.getByUsername({ username });

    if (!usuario) {
      throw new UnauthorizedError("Credenciales inválidas");
    }

    const hashedPassword = crypto
      .createHash("md5")
      .update(password)
      .digest("hex");

    if (hashedPassword !== usuario.password) {
      throw new UnauthorizedError("Credenciales inválidas");
    }

    const { password: _, ...usuarioSinPassword } = usuario;
    return usuarioSinPassword;
  }
}

import crypto from "crypto";
import jwt from "jsonwebtoken";
import { config } from "../config/env.js";
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

  /**
   * Autentica al usuario y devuelve un token JWT junto con los datos del usuario.
   * TODO: Migrar de MD5 a bcrypt cuando se rehasheen las contraseñas en la BD
   */
  static async loginWithToken(username, password) {
    const usuario = await UsuarioService.login(username, password);

    const payload = {
      codigoUsuario: usuario.codigo_usuario,
      nombreUsuario: usuario.nombre_usuario,
      codigoFirma: usuario.codigo_firma,
    };

    const token = jwt.sign(payload, config.jwt.secret, {
      expiresIn: config.jwt.expiresIn,
    });

    return { token, usuario };
  }
}

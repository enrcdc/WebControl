import { UsuarioModel } from "../models/usuario.model.js";

export class UsuarioController {
  static async getAll(req, res, next) {
    try {
      console.log("🟢 Body recibido:", req.body);
      const usuarios = await UsuarioModel.getAll();
      res.json({ success: true, data: usuarios });
    } catch (error) {
      next(error);
    }
  }

  static async login(req, res, next) {
    try {
      const { username, password } = req.body;

      if (!username || !password) {
        return res.status(400).json({
          success: false,
          message: "Usuario y contraseña son requeridos",
        });
      }

      const usuario = await UsuarioModel.verifyCredentials(username, password);

      if (!usuario) {
        return res.status(401).json({
          success: false,
          message: "Credenciales inválidas",
        });
      }

      res.status(200).json({
        success: true,
        data: usuario,
        message: "Login exitoso",
      });
    } catch (error) {
      next(error);
    }
  }
}

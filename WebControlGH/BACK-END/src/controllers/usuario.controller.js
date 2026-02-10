import { UsuarioService } from "../services/usuario.service.js";

export class UsuarioController {
  static async getAll(req, res, next) {
    try {
      const usuarios = await UsuarioService.getAll();
      res.json({ success: true, data: usuarios });
    } catch (error) {
      next(error);
    }
  }

  static async login(req, res, next) {
    try {
      const { username, password } = req.body;
      const usuario = await UsuarioService.login(username, password);
      res.json({ success: true, data: usuario });
    } catch (error) {
      next(error);
    }
  }
}

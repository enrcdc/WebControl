import { UsuarioService } from "../services/usuario.service.js";

export class AuthController {
  static async login(req, res, next) {
    try {
      const { username, password } = req.body;
      const result = await UsuarioService.loginWithToken(username, password);
      res.json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }
}

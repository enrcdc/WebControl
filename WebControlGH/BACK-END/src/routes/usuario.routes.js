import { Router } from "express";
import { UsuarioController } from "../controllers/usuario.controller.js";

export const usuarioRouter = Router();

usuarioRouter.get("/", UsuarioController.getAll);
// TODO: Eliminar cuando el frontend use /api/auth/login con JWT
usuarioRouter.post("/login", UsuarioController.login);

export default usuarioRouter;

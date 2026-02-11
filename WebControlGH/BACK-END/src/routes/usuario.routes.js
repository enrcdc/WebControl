import { Router } from "express";
import { UsuarioController } from "../controllers/usuario.controller.js";

export const usuarioRouter = Router();

usuarioRouter.get("/", UsuarioController.getAll);
usuarioRouter.post("/login", UsuarioController.login);

export default usuarioRouter;

import { Router } from "express";
import { UsuarioController } from "../controllers/usuario.controller.js";
import { errorHandler } from "../middlewares/ErrorHandler.js";

export const usuarioRouter = Router();

usuarioRouter.get("/", UsuarioController.getAll);
usuarioRouter.post("/login", UsuarioController.login);

usuarioRouter.use(errorHandler);

export default usuarioRouter;

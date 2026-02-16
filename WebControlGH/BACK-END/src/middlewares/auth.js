import jwt from "jsonwebtoken";
import { config } from "../config/env.js";
import { UnauthorizedError } from "../errors/index.js";

/**
 * Middleware de autenticación JWT.
 * Verifica el token del header Authorization: Bearer <token>.
 * Si es válido, inyecta req.user con los datos decodificados.
 * Si no hay token o es inválido, lanza UnauthorizedError.
 *
 * @example
 * import { auth } from "../middlewares/auth.js";
 * router.get("/", auth, Controller.getAll);
 */
export const auth = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new UnauthorizedError("Token de autenticación requerido");
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, config.jwt.secret);
    req.user = decoded;
    next();
  } catch (err) {
    throw new UnauthorizedError("Token inválido o expirado");
  }
};

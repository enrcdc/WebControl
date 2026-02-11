import { InvalidDataError } from "../errors/index.js";

/**
 * Middleware de validación Zod para rutas.
 * Valida req.body contra el schema proporcionado.
 * Si la validación falla, lanza InvalidDataError (400).
 * Si la validación pasa, reemplaza req.body con los datos limpios y transformados.
 *
 * @param {import("zod").ZodSchema} schema - Schema Zod para validar
 * @returns {Function} Middleware de Express
 *
 * @example
 * import { validate } from "../middlewares/validate.js";
 * import { obraSchema } from "../validations/obrasValidator.js";
 * obraRouter.post("/", validate(obraSchema), ObraController.create);
 */
export const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);
  if (!result.success) {
    return next(new InvalidDataError("Datos inválidos", result.error.issues));
  }
  req.body = result.data;
  next();
};

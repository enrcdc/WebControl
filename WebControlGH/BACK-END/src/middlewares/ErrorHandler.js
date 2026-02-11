import { AppError } from "../errors/AppError.js";

export function errorHandler(err, req, res, next) {
  // Errores operacionales (heredan de AppError)
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      details: err.details ?? null,
    });
  }

  // ValidationError (Zod — no hereda de AppError)
  if (err.name === "ValidationError") {
    return res.status(400).json({
      success: false,
      message: err.message,
      details: err.details ?? null,
    });
  }

  // EmptyUpdateError (lanzado desde modelos)
  if (err.name === "EmptyUpdateError") {
    return res.status(400).json({
      success: false,
      message: err.message,
      details: null,
    });
  }

  // Error no controlado (500)
  console.error(err);
  res.status(500).json({
    success: false,
    message: "Error interno del servidor",
    details: null,
  });
}

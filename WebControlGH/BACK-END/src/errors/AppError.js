/**
 * Error base de la aplicación
 *
 * Todos los errores personalizados deben heredar de esta clase.
 * Incluye statusCode y isOperational para manejo consistente.
 */

export class AppError extends Error {
  constructor(message, statusCode = 500, isOperational = true, details = null) {
    super(message);

    this.statusCode = statusCode;
    this.isOperational = isOperational; // true = error esperado, false = bug
    this.details = details;

    // Captura el stack trace
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Error 401 - No autorizado
 *
 * El usuario no está autenticado o el token es inválido.
 *
 * Uso:
 *   throw new UnauthorizedError('Token inválido o expirado');
 *   throw new UnauthorizedError('Debes iniciar sesión para acceder a este recurso');
 */

import { AppError } from './AppError.js';

export class UnauthorizedError extends AppError {
  constructor(message = 'No autorizado. Debes iniciar sesión.', details = null) {
    super(message, 401, true, details);
    this.name = 'UnauthorizedError';
  }
}
